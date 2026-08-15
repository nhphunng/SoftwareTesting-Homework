#!/usr/bin/env python3
"""Generate the Scenario C Stress JMX from the reviewed Load JMX."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / "tests/23127194_Load_20260812.jmx"
TARGET = ROOT / "tests/23127194_Stress_20260812.jmx"


def replace_once(text: str, old: str, new: str) -> str:
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"expected one occurrence of {old!r}, found {count}")
    return text.replace(old, new)


def main() -> int:
    if TARGET.exists():
        raise SystemExit(f"refusing to overwrite {TARGET}")
    text = SOURCE.read_text(encoding="utf-8")
    text = replace_once(
        text,
        'testname="23127194 Load 20260812 - Scenario C"',
        'testname="23127194 Stress 20260812 - Scenario C"',
    )
    old_comment = (
        "Human-confirmed contract: 10 VUs, 20 s ramp-up, 140 s scheduler duration "
        "(120 s at full load), no staged ramp-down, 500 ms think-time. Acceptance "
        "from raw JTL: HTTP errors &lt;= 1%, business success &gt;= 99%, end-to-end "
        "p95 &lt;= 250 ms, each transaction p95 &lt;= 100 ms. Summary Report is the "
        "allocated Load listener; raw JTL and HTML report remain authoritative."
    )
    new_comment = (
        "Phase 3 progressive stress contract derived from measured Load evidence: maximum "
        "80 VUs, 240 s linear ramp-up, 300 s flow-start deadline, 250 ms think-time. "
        "Analyze active-thread bands 1-20, 21-40, 41-60, and 61-80. Aggregate Report "
        "is the Stress listener; raw JTL and HTML report remain authoritative."
    )
    text = replace_once(text, old_comment, new_comment)
    text = text.replace("load.threads", "stress.threads")
    text = text.replace("load.ramp_up_seconds", "stress.ramp_up_seconds")
    text = text.replace("load.duration_seconds", "stress.duration_seconds")
    text = text.replace("load.think_time_ms", "stress.think_time_ms")
    text = text.replace("load.deadline_ms", "stress.deadline_ms")
    text = replace_once(text, 'testname="Measured Load - Scenario C"', 'testname="Measured Stress - Scenario C"')
    text = replace_once(text, "Reviewed Think Time", "Stress Think Time")
    text = replace_once(
        text,
        '<ResultCollector guiclass="SummaryReport" testclass="ResultCollector" testname="Summary Report - Human Approved Load Listener" enabled="true">',
        '<ResultCollector guiclass="StatVisualizer" testclass="ResultCollector" testname="Aggregate Report - Stress Listener" enabled="true">',
    )
    TARGET.write_text(text, encoding="utf-8")
    print(TARGET)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
