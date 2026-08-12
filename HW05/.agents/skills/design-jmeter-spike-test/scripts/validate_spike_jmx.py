#!/usr/bin/env python3
"""Validate the structural contract of the final HW05 Spike JMX."""

import argparse
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path


EXPECTED = "23127194_Spike_20260812.jmx"
STAGES = ("Baseline", "Spike", "Recovery")
REQUIRED = (
    "Bearer ${token}",
    "data/scenario-c.local.csv",
    "Response Time Graph",
    "token",
    "orderId",
)


def validate(path: Path) -> list[str]:
    errors: list[str] = []
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
    for stage in STAGES:
        stage_trees = []
        for container in root.findall(".//hashTree"):
            children = list(container)
            for index, node in enumerate(children[:-1]):
                if (
                    node.tag == "ThreadGroup"
                    and stage.lower() in node.get("testname", "").lower()
                    and children[index + 1].tag == "hashTree"
                ):
                    stage_trees.append(children[index + 1])
        if len(stage_trees) != 1:
            errors.append(f"expected exactly one {stage} Thread Group")
            continue
        if len(stage_trees[0].findall(".//HTTPSamplerProxy")) != 9:
            errors.append(f"{stage} stage must contain exactly 9 HTTP samplers")
    for node in root.findall(".//CSVDataSet"):
        props = {item.get("name"): (item.text or "") for item in node.findall("stringProp")}
        if props.get("recycle") != "false" or props.get("stopThread") != "true":
            errors.append("every CSV Data Set must use recycle=false and stopThread=true")
    for listener in root.findall(".//ResultCollector"):
        if listener.get("guiclass") == "ViewResultsFullVisualizer" and listener.get("enabled", "true") == "true":
            errors.append("View Results Tree must be disabled")
    if "Test1234!" in text or "Admin123!" in text:
        errors.append("credential found in JMX")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jmx", nargs="?", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        samplers = "".join("<HTTPSamplerProxy/>" for _ in range(9))
        stages = "".join(
            f'<ThreadGroup testname="{stage} Stage"/><hashTree>{samplers}</hashTree>'
            for stage in STAGES
        )
        fixture = (
            "<jmeterTestPlan><hashTree>" + stages
            + "<CSVDataSet><stringProp name=\"filename\">data/scenario-c.local.csv</stringProp>"
            + "<stringProp name=\"recycle\">false</stringProp><stringProp name=\"stopThread\">true</stringProp></CSVDataSet>"
            + "<HeaderManager><stringProp>Bearer ${token}</stringProp></HeaderManager>"
            + "<JSONPostProcessor><stringProp>token orderId</stringProp></JSONPostProcessor>"
            + "<ResultCollector guiclass=\"RespTimeGraphVisualizer\" testname=\"Response Time Graph\"/>"
            + "<ResultCollector guiclass=\"ViewResultsFullVisualizer\" enabled=\"false\"/></hashTree></jmeterTestPlan>"
        )
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / EXPECTED
            path.write_text(fixture, encoding="utf-8")
            errors = validate(path)
            if errors:
                print("self-test failed: " + "; ".join(errors))
                return 1
        print("self-test passed")
        return 0
    path = args.jmx or Path("HW05/tests") / EXPECTED
    errors = validate(path)
    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors))
        return 1
    print(f"PASS: {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
