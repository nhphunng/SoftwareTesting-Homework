#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/run-step-k.sh <FR05|FR10|FR16> [--dry-run]

Optional environment variables:
  NEWMAN_BIN=/path/to/newman
  NEWMAN_REPORTERS=cli,json,htmlextra,junit
  NEWMAN_TIMEOUT_REQUEST=10000
  POSTMAN_ENVIRONMENT=/custom/environment.json
  POSTMAN_DATA=/custom/data.json

Behavior:
  1. Resolves the collection/environment/data files for the requested FR.
  2. Runs Newman and stores raw evidence under postman/newman/.
  3. Always invokes extract-newman-summary.js when a JSON report exists.
  4. Prints only a compact execution summary to stdout for AI consumption.

The raw Newman reports remain the evidence source of truth; AI should read the
compact *-execution-summary.{json,md} files first and inspect raw files only for
specific failures that require deeper review.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 2
fi

FR="$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]')"
DRY_RUN=false
if [[ "${2:-}" == "--dry-run" ]]; then
  DRY_RUN=true
elif [[ $# -gt 1 ]]; then
  echo "ERROR: unknown option: $2" >&2
  usage
  exit 2
fi

case "$FR" in
  FR05) FEATURE_SLUG="ProductSearch" ;;
  FR10) FEATURE_SLUG="CancelOrder" ;;
  FR16) FEATURE_SLUG="ImportProducts" ;;
  *)
    echo "ERROR: unsupported feature '$FR'. Expected FR05, FR10, or FR16." >&2
    exit 2
    ;;
esac

COLLECTION="postman/collection/HW06-${FR}-${FEATURE_SLUG}.postman_collection.json"
PUBLIC_ENV="postman/environment/HW06-${FR}-Local.postman_environment.json"
PRIVATE_ENV="postman/environment/HW06-${FR}-Local.private.postman_environment.json"
DATA_FILE="postman/data/${FR}-runtime-data.json"

ENVIRONMENT="${POSTMAN_ENVIRONMENT:-}"
if [[ -z "$ENVIRONMENT" ]]; then
  if [[ -f "$PRIVATE_ENV" ]]; then
    ENVIRONMENT="$PRIVATE_ENV"
  else
    ENVIRONMENT="$PUBLIC_ENV"
  fi
fi
DATA="${POSTMAN_DATA:-$DATA_FILE}"

OUT_DIR="postman/newman"
PREFIX="${FR}-official"
CLI_OUT="$OUT_DIR/${PREFIX}-cli.txt"
JSON_OUT="$OUT_DIR/${PREFIX}-report.json"
HTML_OUT="$OUT_DIR/${PREFIX}-report.html"
JUNIT_OUT="$OUT_DIR/${PREFIX}-report.xml"
SUMMARY_BASE="$OUT_DIR/${FR}-execution-summary"

missing=0
for file in "$COLLECTION" "$ENVIRONMENT" "$DATA"; do
  if [[ ! -f "$file" ]]; then
    echo "MISSING: $file" >&2
    missing=1
  fi
done
if [[ $missing -ne 0 ]]; then
  echo "ERROR: Step K runtime inputs are incomplete for $FR." >&2
  exit 3
fi

resolve_newman() {
  if [[ -n "${NEWMAN_BIN:-}" ]]; then
    printf '%s\n' "$NEWMAN_BIN"
    return
  fi
  if command -v newman >/dev/null 2>&1; then
    command -v newman
    return
  fi
  if [[ -x /private/tmp/hw06-newman/node_modules/.bin/newman ]]; then
    printf '%s\n' /private/tmp/hw06-newman/node_modules/.bin/newman
    return
  fi
  echo ""
}

NEWMAN="$(resolve_newman)"
if [[ -z "$NEWMAN" ]]; then
  echo "ERROR: Newman is not installed or discoverable." >&2
  echo "Set NEWMAN_BIN=/path/to/newman or install Newman before Step K." >&2
  exit 4
fi

mkdir -p "$OUT_DIR"
REPORTERS="${NEWMAN_REPORTERS:-cli,json,htmlextra,junit}"
TIMEOUT_REQUEST="${NEWMAN_TIMEOUT_REQUEST:-10000}"

cmd=(
  "$NEWMAN" run "$COLLECTION"
  -e "$ENVIRONMENT"
  -d "$DATA"
  --reporters "$REPORTERS"
  --reporter-json-export "$JSON_OUT"
  --reporter-junit-export "$JUNIT_OUT"
  --color off
  --timeout-request "$TIMEOUT_REQUEST"
)

if [[ "$REPORTERS" == *"htmlextra"* ]]; then
  cmd+=(--reporter-htmlextra-export "$HTML_OUT")
fi

printf 'feature=%s\n' "$FR"
printf 'collection=%s\n' "$COLLECTION"
printf 'environment=%s\n' "$ENVIRONMENT"
printf 'data=%s\n' "$DATA"
printf 'newman=%s\n' "$NEWMAN"
printf 'summary_base=%s\n' "$SUMMARY_BASE"

if $DRY_RUN; then
  printf 'dry_run=true\ncommand='
  printf '%q ' "${cmd[@]}"
  printf '\n'
  exit 0
fi

# Preserve full CLI evidence in a file while keeping terminal output compact.
# Newman may exit non-zero for assertion failures; Step K must still extract and
# preserve the real failure evidence instead of normalizing it away.
set +e
"${cmd[@]}" >"$CLI_OUT" 2>&1
NEWMAN_EXIT=$?
set -e

if [[ ! -f "$JSON_OUT" ]]; then
  echo "ERROR: Newman did not produce $JSON_OUT. See $CLI_OUT" >&2
  exit "$NEWMAN_EXIT"
fi

node scripts/extract-newman-summary.js "$JSON_OUT" "$SUMMARY_BASE"

printf 'newman_exit=%s\n' "$NEWMAN_EXIT"
printf 'raw_cli=%s\n' "$CLI_OUT"
printf 'raw_json=%s\n' "$JSON_OUT"
[[ -f "$HTML_OUT" ]] && printf 'raw_html=%s\n' "$HTML_OUT"
[[ -f "$JUNIT_OUT" ]] && printf 'raw_junit=%s\n' "$JUNIT_OUT"
printf 'ai_summary=%s.md\n' "$SUMMARY_BASE"

# Deliberately return Newman status so CI remains truthful while the compact
# summary is still available for Gate G analysis.
exit "$NEWMAN_EXIT"
