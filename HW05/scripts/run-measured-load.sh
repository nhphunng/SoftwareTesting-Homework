#!/usr/bin/env bash

set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
sut_backend_dir="${SUT_BACKEND_DIR:-/Users/nguyenhoangphihung/Document/eshop-sut-seminar/backend}"
run_suffix="${RUN_SUFFIX:-}"
run_suffix="${run_suffix//[^A-Za-z0-9_-]/}"
artifact_name="23127194_Load_20260812${run_suffix:+_$run_suffix}"
csv_file="$project_dir/data/scenario-c.local.csv"
raw_dir="$project_dir/results/raw/load"
html_dir="$project_dir/results/html/load/$artifact_name"
evidence_dir="$project_dir/evidence/load"
raw_jtl="$raw_dir/$artifact_name.jtl"
jmeter_log="$raw_dir/$artifact_name.jmeter.log"
console_log="$raw_dir/$artifact_name.console.log"
resource_csv="$evidence_dir/$artifact_name-resources.csv"
hardware_file="$evidence_dir/$artifact_name-environment.txt"
order_state_file="$evidence_dir/$artifact_name-order-state.txt"
plan="$project_dir/tests/23127194_Load_20260812.jmx"

for command in jmeter node curl jq ruby sqlite3; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is unavailable: $command" >&2
    exit 1
  }
done

[[ -s "$csv_file" ]] || {
  echo "Local CSV is missing; run provisioning once with a local password first." >&2
  exit 1
}

if [[ -e "$raw_jtl" || -e "$html_dir" ]]; then
  echo "Measured output already exists; refusing to overwrite evidence." >&2
  exit 1
fi

local_password=$(ruby -rcsv -e '
  row = CSV.foreach(ARGV.fetch(0), headers: true).first
  abort "CSV has no password" unless row && row["password"] && !row["password"].empty?
  print row["password"]
' "$csv_file")

mkdir -p "$raw_dir" "$evidence_dir" "$(dirname "$html_dir")"

backend_pid=""
monitor_pid=""
jmeter_pid=""
cleanup() {
  [[ -z "$monitor_pid" ]] || kill "$monitor_pid" 2>/dev/null || true
  [[ -z "$jmeter_pid" ]] || kill "$jmeter_pid" 2>/dev/null || true
  [[ -z "$backend_pid" ]] || kill "$backend_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

(
  cd "$sut_backend_dir"
  exec node server.js
) > /tmp/hw05-eshop-backend.log 2>&1 &
backend_pid=$!

ready=false
for _ in {1..30}; do
  if curl -sS -o /dev/null http://127.0.0.1:3000/api/products; then
    ready=true
    break
  fi
  sleep 1
done
[[ "$ready" == "true" ]] || {
  echo "Backend did not become ready; inspect /tmp/hw05-eshop-backend.log." >&2
  exit 1
}

(
  cd "$project_dir"
  USER_COUNT=10 JMETER_USER_PASSWORD="$local_password" \
    scripts/provision-jmeter-users.sh
)
unset local_password

{
  echo "captured_at=$(date '+%Y-%m-%dT%H:%M:%S%z')"
  echo "architecture=$(uname -m)"
  echo "logical_cpu=$(sysctl -n hw.logicalcpu)"
  echo "memory_bytes=$(sysctl -n hw.memsize)"
  sw_vers
  java -version 2>&1
  jmeter --version 2>&1
} > "$hardware_file"

(
  cd "$project_dir"
  jmeter -n \
    -t tests/23127194_Load_20260812.jmx \
    -Jload.threads=10 \
    -Jload.ramp_up_seconds=20 \
    -Jload.duration_seconds=140 \
    -Jload.think_time_ms=500 \
    -l "$raw_jtl" \
    -j "$jmeter_log" \
    -e -o "$html_dir" > "$console_log" 2>&1
) &
jmeter_pid=$!

{
  echo "timestamp,backend_cpu_pct,backend_rss_kb,jmeter_cpu_pct,jmeter_rss_kb"
  while true; do
    backend_stats=$(ps -p "$backend_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)
    jmeter_os_pid=$(pgrep -f 'ApacheJMeter.jar.*23127194_Load_20260812.jmx' | head -n 1 || true)
    if [[ -n "$jmeter_os_pid" ]]; then
      jmeter_stats=$(ps -p "$jmeter_os_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)
    else
      jmeter_stats=""
    fi
    printf '%s,%s,%s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" \
      "${backend_stats// /,}" "${jmeter_stats// /,}"
    grep -q '\.\.\. end of run' "$console_log" 2>/dev/null && break
    sleep 1
  done
} > "$resource_csv" &
monitor_pid=$!

set +e
wait "$jmeter_pid"
jmeter_status=$?
set -e
jmeter_pid=""
kill "$monitor_pid" 2>/dev/null || true
wait "$monitor_pid" 2>/dev/null || true
monitor_pid=""

sqlite3 "$sut_backend_dir/database.sqlite" \
  "SELECT 'total_orders=' || COUNT(*) FROM orders; SELECT 'canceled_orders=' || COUNT(*) FROM orders WHERE status='canceled'; SELECT 'non_canceled_orders=' || COUNT(*) FROM orders WHERE status<>'canceled';" \
  > "$order_state_file"

if [[ "$jmeter_status" -ne 0 ]]; then
  echo "JMeter failed with status $jmeter_status; inspect $console_log and $jmeter_log." >&2
  exit "$jmeter_status"
fi

echo "Measured Load execution completed."
echo "Raw JTL: $raw_jtl"
echo "HTML report: $html_dir"
echo "Resource samples: $resource_csv"
echo "Order state: $order_state_file"
