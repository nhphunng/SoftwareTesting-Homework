#!/usr/bin/env bash

set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
sut_backend_dir="${SUT_BACKEND_DIR:-/Users/nguyenhoangphihung/Document/eshop-sut-seminar/backend}"
run_suffix="${RUN_SUFFIX:-}"
run_suffix="${run_suffix//[^A-Za-z0-9_-]/}"
artifact_name="23127194_Spike_20260812${run_suffix:+_$run_suffix}"
csv_file="$project_dir/data/scenario-c.local.csv"
raw_dir="$project_dir/results/raw/spike"
html_dir="$project_dir/results/html/spike/$artifact_name"
evidence_dir="$project_dir/evidence/spike"
raw_jtl="$raw_dir/$artifact_name.jtl"
jmeter_log="$raw_dir/$artifact_name.jmeter.log"
console_log="$raw_dir/$artifact_name.console.log"
resource_csv="$evidence_dir/$artifact_name-resources.csv"
environment_file="$evidence_dir/$artifact_name-environment.txt"
order_state_file="$evidence_dir/$artifact_name-order-state.txt"
backend_log="/tmp/hw05-eshop-backend-spike.log"

for command in jmeter node curl ruby sqlite3; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is unavailable: $command" >&2
    exit 1
  }
done

[[ -s "$csv_file" ]] || {
  echo "Local CSV is missing; provision it once with a local password first." >&2
  exit 1
}

for output in "$raw_jtl" "$jmeter_log" "$console_log" "$resource_csv" \
  "$environment_file" "$order_state_file" "$html_dir"; do
  if [[ -e "$output" ]]; then
    echo "Spike output already exists; refusing to overwrite: $output" >&2
    exit 1
  fi
done

local_password=$(ruby -rcsv -e '
  row = CSV.foreach(ARGV.fetch(0), headers: true).first
  abort "CSV has no password" unless row && row["password"] && !row["password"].empty?
  print row["password"]
' "$csv_file")

mkdir -p "$raw_dir" "$evidence_dir" "$(dirname "$html_dir")"

backend_pid=""
jmeter_pid=""
monitor_pid=""
cleanup() {
  [[ -z "$monitor_pid" ]] || kill "$monitor_pid" 2>/dev/null || true
  [[ -z "$jmeter_pid" ]] || kill "$jmeter_pid" 2>/dev/null || true
  [[ -z "$backend_pid" ]] || kill "$backend_pid" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 3000 is already in use; stop the existing backend before Spike execution." >&2
  exit 1
fi

(
  cd "$sut_backend_dir"
  exec node server.js
) > "$backend_log" 2>&1 &
backend_pid=$!

ready=false
for _ in {1..30}; do
  if grep -q 'Database initialized and seeded' "$backend_log" 2>/dev/null \
    && curl -sS -o /dev/null http://127.0.0.1:3000/api/products; then
    ready=true
    break
  fi
  sleep 1
done
[[ "$ready" == "true" ]] || {
  echo "Backend did not become ready; inspect $backend_log." >&2
  exit 1
}

(
  cd "$project_dir"
  USER_COUNT=80 JMETER_USER_PASSWORD="$local_password" scripts/provision-jmeter-users.sh
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
} > "$environment_file"

(
  cd "$project_dir"
  jmeter -n -t tests/23127194_Spike_20260812.jmx \
    -Jspike.baseline_threads=10 \
    -Jspike.baseline_duration_seconds=30 \
    -Jspike.baseline_ramp_seconds=1 \
    -Jspike.peak_threads=80 \
    -Jspike.peak_duration_seconds=60 \
    -Jspike.peak_ramp_seconds=1 \
    -Jspike.recovery_threads=10 \
    -Jspike.recovery_duration_seconds=30 \
    -Jspike.recovery_ramp_seconds=1 \
    -Jspike.think_time_ms=250 \
    -l "$raw_jtl" -j "$jmeter_log" -e -o "$html_dir" > "$console_log" 2>&1
) &
jmeter_pid=$!

{
  echo "timestamp,backend_cpu_pct,backend_rss_kb,jmeter_cpu_pct,jmeter_rss_kb"
  while true; do
    backend_stats=$(ps -p "$backend_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)
    java_pid=$(pgrep -f 'ApacheJMeter.jar.*23127194_Spike_20260812.jmx' | head -n 1 || true)
    if [[ -n "$java_pid" ]]; then
      jmeter_stats=$(ps -p "$java_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)
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

echo "Measured Spike execution completed."
echo "Raw JTL: $raw_jtl"
echo "HTML report: $html_dir"
echo "Resource samples: $resource_csv"
echo "Order state: $order_state_file"
