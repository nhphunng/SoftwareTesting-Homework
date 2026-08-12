#!/usr/bin/env bash

set -euo pipefail

project_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
sut_backend_dir="${SUT_BACKEND_DIR:-/Users/nguyenhoangphihung/Document/eshop-sut-seminar/backend}"
run_suffix="${RUN_SUFFIX:-}"
run_suffix="${run_suffix//[^A-Za-z0-9_-]/}"
artifact_name="23127194_Endurance_20260812${run_suffix:+_$run_suffix}"
csv_file="$project_dir/data/scenario-c.local.csv"
raw_dir="$project_dir/results/raw/endurance"
html_dir="$project_dir/results/html/endurance/$artifact_name"
evidence_dir="$project_dir/evidence/endurance"
raw_jtl="$raw_dir/$artifact_name.jtl"
jmeter_log="$raw_dir/$artifact_name.jmeter.log"
console_log="$raw_dir/$artifact_name.console.log"
backend_log="$raw_dir/$artifact_name.backend.log"
resource_csv="$evidence_dir/$artifact_name-resources.csv"
environment_file="$evidence_dir/$artifact_name-environment.txt"
order_state_file="$evidence_dir/$artifact_name-order-state.txt"

for command in jmeter node curl ruby sqlite3 shasum; do
  command -v "$command" >/dev/null 2>&1 || {
    echo "Required command is unavailable: $command" >&2
    exit 1
  }
done

[[ -s "$csv_file" ]] || {
  echo "Local CSV is missing; provision it once with a local password first." >&2
  exit 1
}

available_kb=$(df -Pk "$project_dir" | awk 'NR==2 {print $4}')
[[ "$available_kb" =~ ^[0-9]+$ ]] && (( available_kb >= 2097152 )) || {
  echo "At least 2 GiB free disk space is required for Endurance evidence." >&2
  exit 1
}

for output in "$raw_jtl" "$jmeter_log" "$console_log" "$backend_log" \
  "$resource_csv" "$environment_file" "$order_state_file" "$html_dir"; do
  if [[ -e "$output" ]]; then
    echo "Endurance output already exists; refusing to overwrite: $output" >&2
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
  echo "Port 3000 is already in use; stop the existing backend before Endurance execution." >&2
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
  USER_COUNT=60 JMETER_USER_PASSWORD="$local_password" scripts/provision-jmeter-users.sh
)
unset local_password

{
  echo "artifact=$artifact_name"
  echo "captured_at=$(date '+%Y-%m-%dT%H:%M:%S%z')"
  echo "plan_sha256=$(shasum -a 256 "$project_dir/tests/23127194_Endurance_20260812.jmx" | awk '{print $1}')"
  echo "workload=60_threads,30s_ramp,720s_flow_start_duration,250ms_think_time"
  echo "resource_interval_seconds=1"
  echo "analysis_window_seconds=60"
  echo "architecture=$(uname -m)"
  echo "logical_cpu=$(sysctl -n hw.logicalcpu)"
  echo "memory_bytes=$(sysctl -n hw.memsize)"
  sw_vers
  java -version 2>&1
  jmeter --version 2>&1
} > "$environment_file"

(
  cd "$project_dir"
  jmeter -n -t tests/23127194_Endurance_20260812.jmx \
    -Jendurance.threads=60 \
    -Jendurance.ramp_up_seconds=30 \
    -Jendurance.duration_seconds=720 \
    -Jendurance.think_time_ms=250 \
    -l "$raw_jtl" -j "$jmeter_log" -e -o "$html_dir" > "$console_log" 2>&1
) &
jmeter_pid=$!

{
  echo "timestamp,backend_cpu_pct,backend_rss_kb,jmeter_cpu_pct,jmeter_rss_kb"
  while kill -0 "$jmeter_pid" 2>/dev/null; do
    read -r backend_cpu backend_rss <<< "$(ps -p "$backend_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)"
    java_pid=$(pgrep -f 'ApacheJMeter.jar.*23127194_Endurance_20260812.jmx' | head -n 1 || true)
    jmeter_cpu=""
    jmeter_rss=""
    if [[ -n "$java_pid" ]]; then
      read -r jmeter_cpu jmeter_rss <<< "$(ps -p "$java_pid" -o %cpu= -o rss= 2>/dev/null | xargs || true)"
    fi
    printf '%s,%s,%s,%s,%s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" \
      "${backend_cpu:-}" "${backend_rss:-}" "${jmeter_cpu:-}" "${jmeter_rss:-}"
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

backend_alive=false
kill -0 "$backend_pid" 2>/dev/null && backend_alive=true
backend_ready_http=$(curl -sS -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/api/products 2>/dev/null || true)
{
  echo "backend_alive=$backend_alive"
  echo "backend_ready_http=$backend_ready_http"
  sqlite3 "$sut_backend_dir/database.sqlite" \
    "SELECT 'total_orders=' || COUNT(*) FROM orders; SELECT 'canceled_orders=' || COUNT(*) FROM orders WHERE status='canceled'; SELECT 'non_canceled_orders=' || COUNT(*) FROM orders WHERE status<>'canceled';"
} > "$order_state_file"

if [[ "$jmeter_status" -ne 0 ]]; then
  echo "JMeter failed with status $jmeter_status; inspect $console_log and $jmeter_log." >&2
  exit "$jmeter_status"
fi

echo "Measured Endurance execution completed."
echo "Raw JTL: $raw_jtl"
echo "HTML report: $html_dir"
echo "Resource samples: $resource_csv"
echo "Environment: $environment_file"
echo "Order state: $order_state_file"
