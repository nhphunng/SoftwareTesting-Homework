#!/usr/bin/env bash

set -euo pipefail

sut_backend_dir="${SUT_BACKEND_DIR:-/Users/nguyenhoangphihung/Document/eshop-sut-seminar/backend}"
base_url="${BASE_URL:-http://127.0.0.1:3000}"
backend_log="${BACKEND_LOG:-/tmp/hw05-eshop-backend.log}"

if [[ -z "${USER_COUNT:-}" || -z "${JMETER_USER_PASSWORD:-}" ]]; then
  echo "USER_COUNT and JMETER_USER_PASSWORD are required." >&2
  exit 1
fi

if [[ ! -f "$sut_backend_dir/server.js" ]]; then
  echo "SUT backend not found at $sut_backend_dir." >&2
  exit 1
fi

(
  cd "$sut_backend_dir"
  node server.js >"$backend_log" 2>&1 &
  echo $! > /tmp/hw05-eshop-backend.pid
)

for _ in {1..30}; do
  if curl -sS -o /dev/null "$base_url/api/products"; then
    break
  fi
  sleep 1
done

if ! curl -sS -o /dev/null "$base_url/api/products"; then
  echo "Backend did not become ready. Inspect $backend_log." >&2
  exit 1
fi

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
"$script_dir/provision-jmeter-users.sh"

echo "Backend PID: $(cat /tmp/hw05-eshop-backend.pid)"
echo "Backend log: $backend_log"
