#!/usr/bin/env python3
"""Validate the fixed HW05 Scenario C Stress JMX contract."""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path


EXPECTED = "23127194_Stress_20260812.jmx"
REQUIRED = (
    "__P(stress.threads,)",
    "__P(stress.ramp_up_seconds,)",
    "__P(stress.duration_seconds,)",
    "__P(stress.think_time_ms,)",
    "Bearer ${token}",
    "data/scenario-c.local.csv",
    "Aggregate Report - Stress Listener",
)


def validate(path: Path) -> list[str]:
    errors = []
    if path.name != EXPECTED:
        errors.append(f"filename must be {EXPECTED}")
    try:
        root = ET.parse(path).getroot()
    except (OSError, ET.ParseError) as exc:
        return errors + [f"cannot parse JMX: {exc}"]
    text = ET.tostring(root, encoding="unicode")
    for value in REQUIRED:
        if value not in text:
            errors.append(f"missing {value}")
    samplers = [(n.findtext("stringProp[@name='HTTPSampler.method']"), n.findtext("stringProp[@name='HTTPSampler.path']")) for n in root.findall(".//HTTPSamplerProxy")]
    if len(samplers) != 9:
        errors.append(f"expected 9 HTTP samplers, found {len(samplers)}")
    for node in root.findall(".//CSVDataSet"):
        props = {n.get("name"): (n.text or "") for n in node.findall("stringProp")}
        if props.get("recycle") != "false" or props.get("stopThread") != "true":
            errors.append("CSV must use recycle=false and stopThread=true")
    for listener in root.findall(".//ResultCollector"):
        if listener.get("guiclass") == "ViewResultsFullVisualizer" and listener.get("enabled", "true") == "true":
            errors.append("View Results Tree must be disabled")
    if "Test1234!" in text or "Admin123!" in text:
        errors.append("credential found in JMX")
    return errors


def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) == 2 else Path("HW05/tests") / EXPECTED
    errors = validate(path)
    if errors:
        print("\n".join(f"ERROR: {item}" for item in errors))
        return 1
    print(f"PASS: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
