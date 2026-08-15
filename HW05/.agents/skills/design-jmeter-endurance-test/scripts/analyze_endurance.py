#!/usr/bin/env python3
"""Analyze HW05 Endurance JTL and resource evidence in fixed steady-state windows."""

import argparse
import csv
import json
import math
from datetime import datetime
from pathlib import Path
from statistics import mean


E2E = "00 Scenario C End-to-End"
HTTP_LABELS = {
    "01 Login",
    "02 Search Products",
    "03 Product Detail",
    "04 Add To Cart",
    "05 Verify Cart",
    "06 Checkout",
    "07 Read Fresh Order",
    "08 Cancel Fresh Order",
    "09 Verify Canceled History",
}
TRANSACTION_LABELS = {
    "01 Auth Heavy",
    "02 Read Heavy",
    "03 Transactional Cart",
    "04 Transactional Checkout",
    "05 Transactional Order Lifecycle",
}
SETUP_LABEL = "Validate required endurance properties and CSV capacity"


def p95(values: list[int]) -> float | None:
    if not values:
        return None
    ordered = sorted(values)
    return float(ordered[max(0, math.ceil(0.95 * len(ordered)) - 1)])


def percent(numerator: int, denominator: int) -> float:
    return 0.0 if denominator == 0 else numerator * 100.0 / denominator


def load_jtl(path: Path) -> list[dict]:
    rows: list[dict] = []
    with path.open(newline="", encoding="utf-8") as stream:
        for row in csv.DictReader(stream):
            rows.append(
                {
                    "timestamp": int(row["timeStamp"]),
                    "elapsed": int(row["elapsed"]),
                    "label": row["label"],
                    "success": row["success"].lower() == "true",
                }
            )
    return rows


def optional_float(value: str | None) -> float | None:
    if value is None or not value.strip():
        return None
    return float(value)


def load_resources(path: Path) -> list[dict]:
    rows: list[dict] = []
    with path.open(newline="", encoding="utf-8") as stream:
        for row in csv.DictReader(stream):
            timestamp = datetime.strptime(row["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
            rows.append(
                {
                    "timestamp": int(timestamp.timestamp() * 1000),
                    "backend_cpu": optional_float(row.get("backend_cpu_pct")),
                    "backend_rss_mib": (
                        None
                        if optional_float(row.get("backend_rss_kb")) is None
                        else optional_float(row.get("backend_rss_kb")) / 1024.0
                    ),
                    "jmeter_cpu": optional_float(row.get("jmeter_cpu_pct")),
                    "jmeter_rss_mib": (
                        None
                        if optional_float(row.get("jmeter_rss_kb")) is None
                        else optional_float(row.get("jmeter_rss_kb")) / 1024.0
                    ),
                }
            )
    return rows


def stats(values: list[float]) -> dict:
    return {
        "samples": len(values),
        "average": None if not values else mean(values),
        "peak": None if not values else max(values),
        "start": None if not values else values[0],
        "end": None if not values else values[-1],
    }


def linear_slope_per_minute(points: list[tuple[int, float]]) -> float | None:
    if len(points) < 2:
        return None
    origin = points[0][0]
    xs = [(timestamp - origin) / 60000.0 for timestamp, _ in points]
    ys = [value for _, value in points]
    x_mean = mean(xs)
    y_mean = mean(ys)
    denominator = sum((value - x_mean) ** 2 for value in xs)
    if denominator == 0:
        return None
    return sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, ys)) / denominator


def analyze(args: argparse.Namespace) -> dict:
    rows = load_jtl(args.jtl)
    resources = load_resources(args.resources)
    setup = [row for row in rows if row["label"] == SETUP_LABEL]
    flows = [row for row in rows if row["label"] == E2E]
    http = [row for row in rows if row["label"] in HTTP_LABELS]
    transactions = [row for row in rows if row["label"] in TRANSACTION_LABELS]
    if len(setup) != 1 or not flows:
        raise ValueError("JTL must contain one setup gate and measured end-to-end flows")

    deadline = setup[0]["timestamp"] + args.duration_seconds * 1000
    measured_start = min(row["timestamp"] for row in flows)
    measured_end = max(row["timestamp"] + row["elapsed"] for row in flows)
    steady_start = measured_start + args.ramp_seconds * 1000
    window_ms = args.window_seconds * 1000

    windows: list[dict] = []
    start = steady_start
    index = 1
    while start + window_ms <= deadline:
        end = start + window_ms
        window_flows = [row for row in flows if start <= row["timestamp"] < end]
        window_http = [row for row in http if start <= row["timestamp"] < end]
        window_transactions = [row for row in transactions if start <= row["timestamp"] < end]
        transaction_p95 = {
            label: p95([row["elapsed"] for row in window_transactions if row["label"] == label])
            for label in sorted(TRANSACTION_LABELS)
        }
        highest_transaction = max(value for value in transaction_p95.values() if value is not None)
        failed_http = sum(not row["success"] for row in window_http)
        successful_flows = sum(row["success"] for row in window_flows)
        e2e_p95 = p95([row["elapsed"] for row in window_flows])
        passed = (
            percent(failed_http, len(window_http)) <= 1.0
            and percent(successful_flows, len(window_flows)) >= 99.0
            and e2e_p95 is not None
            and e2e_p95 <= 250.0
            and highest_transaction <= 100.0
        )
        resource_window = [row for row in resources if start <= row["timestamp"] < end]
        windows.append(
            {
                "window": index,
                "start_timestamp": start,
                "end_timestamp": end,
                "flows": len(window_flows),
                "business_success_percent": percent(successful_flows, len(window_flows)),
                "flow_rps": len(window_flows) / args.window_seconds,
                "http_samples": len(window_http),
                "http_error_percent": percent(failed_http, len(window_http)),
                "e2e_p95_ms": e2e_p95,
                "highest_transaction_p95_ms": highest_transaction,
                "transaction_p95_ms": transaction_p95,
                "backend_cpu": stats([row["backend_cpu"] for row in resource_window if row["backend_cpu"] is not None]),
                "backend_rss_mib": stats([row["backend_rss_mib"] for row in resource_window if row["backend_rss_mib"] is not None]),
                "passed": passed,
            }
        )
        start = end
        index += 1

    backend_cpu = [row["backend_cpu"] for row in resources if row["backend_cpu"] is not None]
    backend_rss = [row["backend_rss_mib"] for row in resources if row["backend_rss_mib"] is not None]
    jmeter_cpu = [row["jmeter_cpu"] for row in resources if row["jmeter_cpu"] is not None]
    jmeter_rss = [row["jmeter_rss_mib"] for row in resources if row["jmeter_rss_mib"] is not None]
    tail_start = windows[-5]["start_timestamp"] if len(windows) >= 5 else steady_start
    tail_end = windows[-1]["end_timestamp"] if windows else deadline
    tail_points = [
        (row["timestamp"], row["backend_rss_mib"])
        for row in resources
        if tail_start <= row["timestamp"] < tail_end and row["backend_rss_mib"] is not None
    ]

    failed_rows = sum(not row["success"] for row in rows)
    failed_http = sum(not row["success"] for row in http)
    successful_flows = sum(row["success"] for row in flows)
    transaction_p95 = {
        label: p95([row["elapsed"] for row in transactions if row["label"] == label])
        for label in sorted(TRANSACTION_LABELS)
    }
    elapsed_seconds = (measured_end - measured_start) / 1000.0
    return {
        "identity": {
            "jtl": str(args.jtl),
            "resources": str(args.resources),
            "measured_start_timestamp": measured_start,
            "measured_end_timestamp": measured_end,
            "elapsed_seconds": elapsed_seconds,
            "steady_start_timestamp": steady_start,
            "flow_start_deadline_timestamp": deadline,
            "ramp_seconds": args.ramp_seconds,
            "duration_seconds": args.duration_seconds,
            "window_seconds": args.window_seconds,
        },
        "overall": {
            "jtl_rows": len(rows),
            "failed_jtl_rows": failed_rows,
            "flows": len(flows),
            "successful_flows": successful_flows,
            "business_success_percent": percent(successful_flows, len(flows)),
            "observed_flow_rps": len(flows) / elapsed_seconds,
            "http_samples": len(http),
            "failed_http_samples": failed_http,
            "http_error_percent": percent(failed_http, len(http)),
            "e2e_average_ms": mean(row["elapsed"] for row in flows),
            "e2e_p95_ms": p95([row["elapsed"] for row in flows]),
            "transaction_p95_ms": transaction_p95,
            "highest_transaction_p95_ms": max(value for value in transaction_p95.values() if value is not None),
            "expected_http_from_complete_flows": len(flows) * 9,
            "http_flow_count_consistent": len(http) == len(flows) * 9,
        },
        "steady_windows": windows,
        "stable_window_count": sum(window["passed"] for window in windows),
        "maximum_observed_stable_flow_rps": max(
            (window["flow_rps"] for window in windows if window["passed"]), default=None
        ),
        "resources": {
            "rows": len(resources),
            "backend_cpu_percent": stats(backend_cpu),
            "backend_rss_mib": stats(backend_rss),
            "jmeter_cpu_percent": stats(jmeter_cpu),
            "jmeter_rss_mib": stats(jmeter_rss),
            "tail_window_minutes": 5 if len(windows) >= 5 else len(windows),
            "tail_backend_rss_mib_per_minute_slope": linear_slope_per_minute(tail_points),
            "tail_backend_rss_mib": stats([value for _, value in tail_points]),
            "memory_plateau_claimed": False,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jtl", type=Path)
    parser.add_argument("resources", type=Path)
    parser.add_argument("--ramp-seconds", type=int, default=30)
    parser.add_argument("--duration-seconds", type=int, default=720)
    parser.add_argument("--window-seconds", type=int, default=60)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = analyze(args)
    rendered = json.dumps(result, indent=2, sort_keys=True)
    if args.output:
        if args.output.exists():
            parser.error(f"refusing to overwrite existing analysis: {args.output}")
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
