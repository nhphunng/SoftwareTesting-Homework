#!/usr/bin/env bash

set -euo pipefail

base_url="${BASE_URL:-http://127.0.0.1:3000}"
student_id="${STUDENT_ID:-23127194}"
user_count="${USER_COUNT:-}"
user_password="${JMETER_USER_PASSWORD:-}"
output_file="${OUTPUT_FILE:-data/scenario-c.local.csv}"
search_keyword="${SEARCH_KEYWORD:-iPhone}"
product_id="${PRODUCT_ID:-1}"
quantity="${QUANTITY:-1}"

if [[ -z "$user_count" || ! "$user_count" =~ ^[1-9][0-9]*$ ]]; then
  echo "USER_COUNT must be a positive integer." >&2
  exit 1
fi

if [[ -z "$user_password" ]]; then
  echo "JMETER_USER_PASSWORD is required and must not be committed." >&2
  exit 1
fi

if ! command -v curl >/dev/null 2>&1 || ! command -v jq >/dev/null 2>&1; then
  echo "curl and jq are required." >&2
  exit 1
fi

health_code=$(curl -sS -o /dev/null -w '%{http_code}' "$base_url/api/products")
if [[ "$health_code" != "200" ]]; then
  echo "Backend health check failed with HTTP $health_code at $base_url." >&2
  exit 1
fi

product_payload=$(curl -sS "$base_url/api/products/$product_id")
if ! jq -e --argjson id "$product_id" '(.id == $id) and ((.price | tonumber) > 0)' \
  >/dev/null <<<"$product_payload"; then
  echo "PRODUCT_ID $product_id is unavailable or has an invalid price." >&2
  exit 1
fi

output_directory=$(dirname "$output_file")
mkdir -p "$output_directory"
temporary_file=$(mktemp "${TMPDIR:-/tmp}/hw05-jmeter-users.XXXXXX")
cleanup() {
  rm -f "$temporary_file"
}
trap cleanup EXIT

printf '%s\n' 'email,password,search_keyword,product_id,quantity,shipping_address' \
  > "$temporary_file"

created=0
reused=0

for ((index = 1; index <= user_count; index += 1)); do
  suffix=$(printf '%04d' "$index")
  email="hw05-${student_id}-${suffix}@eshop.local"
  name="HW05 JMeter User ${suffix}"
  address="HW05 Scenario C User ${suffix}, Ho Chi Minh City"

  login_payload=$(jq -n --arg email "$email" --arg password "$user_password" \
    '{email:$email,password:$password}')
  login_code=$(curl -sS -o /dev/null -w '%{http_code}' \
    -H 'Content-Type: application/json' \
    --data-binary "$login_payload" \
    "$base_url/api/login")

  if [[ "$login_code" == "200" ]]; then
    reused=$((reused + 1))
  else
    register_payload=$(jq -n \
      --arg name "$name" \
      --arg email "$email" \
      --arg password "$user_password" \
      '{name:$name,email:$email,password:$password}')
    register_code=$(curl -sS -o /dev/null -w '%{http_code}' \
      -H 'Content-Type: application/json' \
      --data-binary "$register_payload" \
      "$base_url/api/register")
    if [[ "$register_code" != "200" ]]; then
      echo "Registration failed for $email with HTTP $register_code." >&2
      exit 1
    fi

    verify_code=000
    for _ in {1..5}; do
      verify_code=$(curl -sS -o /dev/null -w '%{http_code}' \
        -H 'Content-Type: application/json' \
        --data-binary "$login_payload" \
        "$base_url/api/login")
      [[ "$verify_code" == "200" ]] && break
      sleep 0.2
    done
    if [[ "$verify_code" != "200" ]]; then
      echo "Post-registration login failed for $email with HTTP $verify_code." >&2
      exit 1
    fi
    created=$((created + 1))
  fi

  jq -nr \
    --arg email "$email" \
    --arg password "$user_password" \
    --arg search "$search_keyword" \
    --arg product "$product_id" \
    --arg quantity "$quantity" \
    --arg address "$address" \
    '[$email,$password,$search,$product,$quantity,$address] | @csv' \
    >> "$temporary_file"
done

mv "$temporary_file" "$output_file"
trap - EXIT
chmod 600 "$output_file"

echo "Provisioning complete: created=$created reused=$reused total=$user_count"
echo "Local JMeter CSV: $output_file (mode 600; Git-ignored)"
