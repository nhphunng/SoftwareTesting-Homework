#!/usr/bin/env python3
"""Calculate Scenario C Stress metrics by recorded active-thread band."""

import csv
import json
import math
import sys
from collections import defaultdict
from pathlib import Path


BANDS = ((1, 20), (21, 40), (41, 60), (61, 80))
TRANSACTIONS = {
    "00 Scenario C End-to-End",
    "01 Auth Heavy",
    "02 Read Heavy",
    "03 Transactional Cart",
    "04 Transactional Checkout",
    "05 Transactional Order Lifecycle",
}


def percentile(values: list[int], fraction: float) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    rank = (len(ordered) - 1) * fraction
    low, high = math.floor(rank), math.ceil(rank)
    if low == high:
        return float(ordered[low])
    return ordered[low] + (ordered[high] - ordered[low]) * (rank - low)


def band_for(active: int) -> str | None:
    for low, high in BANDS:
        if low <= active <= high:
            return f"{low}-{high}"
    return None


def main() -> int:
    if len(sys.argv) != 2:
        raise SystemExit("usage: analyze_stress_jtl.py RAW_JTL")
    groups = defaultdict(lambda: {"http": [], "transactions": defaultdict(list)})
    with Path(sys.argv[1]).open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            band = band_for(int(row["allThreads"]))
            if not band:
                continue
            sample = {"elapsed": int(row["elapsed"]), "success": row["success"].lower() == "true", "timestamp": int(row["timeStamp"])}
            if row.get("URL") and row["URL"] != "null":
                groups[band]["http"].append(sample)
            if row["label"] in TRANSACTIONS:
                groups[band]["transactions"][row["label"]].append(sample)
    output = {}
    for low, high in BANDS:
        key = f"{low}-{high}"
        group = groups[key]
        e2e = group["transactions"]["00 Scenario C End-to-End"]
        http = group["http"]
        all_tx_p95 = {
            label: percentile([x["elapsed"] for x in samples], .95)
            for label, samples in group["transactions"].items()
            if label != "00 Scenario C End-to-End"
        }
        timestamps = [x["timestamp"] for x in e2e]
        window_seconds = ((max(timestamps) - min(timestamps)) / 1000) if len(timestamps) > 1 else None
        output[key] = {
            "flows": len(e2e),
            "business_success_pct": 100 * sum(x["success"] for x in e2e) / len(e2e) if e2e else None,
            "http_samples": len(http),
            "http_error_pct": 100 * sum(not x["success"] for x in http) / len(http) if http else None,
            "end_to_end_average_ms": sum(x["elapsed"] for x in e2e) / len(e2e) if e2e else None,
            "end_to_end_p95_ms": percentile([x["elapsed"] for x in e2e], .95),
            "highest_transaction_p95_ms": max((v for v in all_tx_p95.values() if v is not None), default=None),
            "observed_flow_throughput_per_sec": len(e2e) / window_seconds if window_seconds and window_seconds > 0 else None,
        }
    print(json.dumps(output, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
