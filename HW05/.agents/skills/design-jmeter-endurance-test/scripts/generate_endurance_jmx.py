#!/usr/bin/env python3
"""Generate the human-confirmed HW05 Endurance JMX from the validated Load plan."""

import argparse
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[4]
SOURCE = PROJECT / "tests" / "23127194_Load_20260812.jmx"
OUTPUT = PROJECT / "tests" / "23127194_Endurance_20260812.jmx"


def positive(value: str) -> int:
    number = int(value)
    if number <= 0:
        raise argparse.ArgumentTypeError("expected a positive integer")
    return number


def non_negative(value: str) -> int:
    number = int(value)
    if number < 0:
        raise argparse.ArgumentTypeError("expected a non-negative integer")
    return number


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--threads", required=True, type=positive)
    parser.add_argument("--ramp-seconds", required=True, type=positive)
    parser.add_argument("--duration-seconds", required=True, type=positive)
    parser.add_argument("--think-time-ms", required=True, type=non_negative)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()

    if args.threads >= 80:
        parser.error("threads must stay below the current highest tested concurrency of 80")
    if not 600 <= args.duration_seconds <= 900:
        parser.error("duration must be within the assignment's 600-900 second range")
    if args.ramp_seconds >= args.duration_seconds:
        parser.error("ramp must be shorter than duration")
    if args.output.exists():
        parser.error(f"refusing to overwrite existing plan: {args.output}")

    text = SOURCE.read_text(encoding="utf-8")
    old_comment = (
        "Human-confirmed contract: 10 VUs, 20 s ramp-up, 140 s scheduler duration "
        "(120 s at full load), no staged ramp-down, 500 ms think-time. Acceptance from raw JTL: "
        "HTTP errors &lt;= 1%, business success &gt;= 99%, end-to-end p95 &lt;= 250 ms, "
        "each transaction p95 &lt;= 100 ms. Summary Report is the allocated Load listener; "
        "raw JTL and HTML report remain authoritative."
    )
    new_comment = (
        f"Human-confirmed Endurance contract: {args.threads} threads, {args.ramp_seconds} s ramp-up, "
        f"{args.duration_seconds} s graceful flow-start duration, {args.think_time_ms} ms think-time. "
        "Acceptance from untouched raw JTL: HTTP errors &lt;= 1%, business success &gt;= 99%, "
        "end-to-end p95 &lt;= 250 ms, and each transaction p95 &lt;= 100 ms overall and per reviewed "
        "steady-state minute. GUI listeners are disabled; raw JTL, HTML report, timestamped backend "
        "resources, and order state remain authoritative. Report only maximum observed stable RPS and "
        "maximum observed backend RSS unless a reviewed plateau criterion is supported by evidence."
    )
    replacements = {
        "23127194 Load 20260812 - Scenario C": "23127194 Endurance 20260812 - Scenario C",
        old_comment: new_comment,
        "Unmeasured Setup - Validate Reviewed Runtime Properties": "Unmeasured Setup - Validate Endurance Runtime Properties",
        "Validate required load properties and CSV capacity": "Validate required endurance properties and CSV capacity",
        "Measured Load - Scenario C": "Measured Endurance - Scenario C",
        "Reviewed Think Time": "Reviewed Endurance Think Time",
        "Start New Flow Only Before Reviewed Deadline": "Start New Flow Only Before Endurance Deadline",
        "load.": "endurance.",
        'testname="Summary Report - Human Approved Load Listener" enabled="true"': 'testname="Summary Report - Reference Only - Disabled" enabled="false"',
    }
    for old, new in replacements.items():
        if old not in text:
            parser.error(f"source contract changed; missing expected text: {old}")
        text = text.replace(old, new)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(text, encoding="utf-8")
    print(f"generated {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
