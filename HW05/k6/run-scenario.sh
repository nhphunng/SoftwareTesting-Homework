#!/usr/bin/env bash
set -euo pipefail

scenario="${1:?Usage: ./k6/run-scenario.sh load|stress|spike|endurance}"
run_date="${RUN_DATE:-20260810}"
student_id="${STUDENT_ID:-23127194}"

if rg -n "REPLACE_ME" k6/data >/dev/null 2>&1; then
  printf 'Replace all sample credentials in k6/data before running.\n' >&2
  exit 2
fi

mkdir -p results/raw results/reports/load results/reports/stress results/reports/spike results/reports/endurance

case "$scenario" in
  load)
    K6_WEB_DASHBOARD=true \
    K6_WEB_DASHBOARD_EXPORT="results/reports/load/${student_id}_Load_${run_date}.html" \
      k6 run --out "json=results/raw/${student_id}_Load_${run_date}.json" \
      "k6/plans/${student_id}_Load_${run_date}.js"
    ;;
  stress)
    k6 run --out "json=results/raw/${student_id}_Stress_${run_date}.json" \
      --summary-mode=full "k6/plans/${student_id}_Stress_${run_date}.js" 2>&1 \
      | tee "results/reports/stress/${student_id}_Stress_${run_date}-console.txt"
    ;;
  spike)
    k6 run --out "json=results/raw/${student_id}_Spike_${run_date}.json" \
      --summary-export="results/reports/spike/${student_id}_Spike_${run_date}-summary.json" \
      "k6/plans/${student_id}_Spike_${run_date}.js"
    ;;
  endurance)
    k6 run --summary-export="results/reports/endurance/${student_id}_Endurance_${run_date}-summary.json" \
      "k6/plans/${student_id}_Endurance_${run_date}.js"
    ;;
  *)
    printf 'Unknown scenario: %s\n' "$scenario" >&2
    exit 2
    ;;
esac
