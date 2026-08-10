#!/usr/bin/env bash
set -euo pipefail

root="${1:-.}"
failed=0

require_glob() {
  local label="$1"
  local pattern="$2"
  if compgen -G "$root/$pattern" >/dev/null; then
    printf 'OK   %s\n' "$label"
  else
    printf 'MISS %s (%s)\n' "$label" "$pattern"
    failed=1
  fi
}

require_count() {
  local label="$1"
  local directory="$2"
  local minimum="$3"
  local count
  count="$(find "$root/$directory" -type f ! -name '.gitkeep' 2>/dev/null | wc -l | tr -d ' ')"
  if [[ "$count" -ge "$minimum" ]]; then
    printf 'OK   %s (%s)\n' "$label" "$count"
  else
    printf 'MISS %s (found %s; need %s)\n' "$label" "$count" "$minimum"
    failed=1
  fi
}

require_glob "main report" "report/main-report.md"
require_glob "AI critique" "report/ai-critique.md"
require_glob "AI audit" "audit/ai-audit-report.md"
require_glob "Load plan" "k6/plans/*_Load_????????.js"
require_glob "Stress plan" "k6/plans/*_Stress_????????.js"
require_glob "Spike plan" "k6/plans/*_Spike_????????.js"
require_glob "Endurance plan" "k6/plans/*_Endurance_????????.js"
require_count "CSV inputs" "k6/data" 3
require_count "raw Load/Stress/Spike outputs" "results/raw" 3
require_count "distinct report outputs" "results/reports" 3
require_count "resource evidence" "evidence/resource-monitor" 4
require_count "hardware evidence" "evidence/hardware" 1
require_glob "demo link" "video/demo-link.md"
require_glob "git commit log" "git-commit-log.txt"

if rg -n "TODO|TBD|PLACEHOLDER|REPLACE_ME|youtube\.com/TODO" \
  "$root/report" "$root/audit" "$root/README.md" "$root/video" "$root/k6/data" "$root/git-commit-log.txt" >/dev/null 2>&1; then
  printf 'WARN unresolved placeholders remain in final documents\n'
  failed=1
fi

exit "$failed"
