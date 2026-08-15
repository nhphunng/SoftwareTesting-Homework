#!/usr/bin/env python3
"""Validate the structural contract of the final HW05 Endurance JMX."""

import argparse
import copy
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path


EXPECTED = "23127194_Endurance_20260812.jmx"
LOAD_PLAN = Path(__file__).resolve().parents[4] / "tests" / "23127194_Load_20260812.jmx"
PROPERTIES = (
    "endurance.threads",
    "endurance.ramp_up_seconds",
    "endurance.duration_seconds",
    "endurance.think_time_ms",
)


def paired_tree(container: ET.Element, node: ET.Element) -> ET.Element | None:
    children = list(container)
    index = children.index(node)
    if index + 1 < len(children) and children[index + 1].tag == "hashTree":
        return children[index + 1]
    return None


def measured_tree(root: ET.Element) -> ET.Element:
    groups = [node for node in root.findall(".//ThreadGroup") if "Measured" in node.get("testname", "")]
    if len(groups) != 1:
        raise ValueError("expected exactly one measured Thread Group")
    group = groups[0]
    for container in root.findall(".//hashTree"):
        if group in list(container):
            tree = paired_tree(container, group)
            if tree is not None:
                return tree
    raise ValueError("measured Thread Group has no paired tree")


def sampler_contracts(container: ET.Element) -> list[bytes]:
    contracts: list[bytes] = []
    for parent in container.iter("hashTree"):
        for sampler in parent.findall("HTTPSamplerProxy"):
            assertions = paired_tree(parent, sampler)
            if assertions is None:
                continue
            pair = ET.Element("pair")
            pair.extend((copy.deepcopy(sampler), copy.deepcopy(assertions)))
            for item in pair.iter():
                if item.text is not None and not item.text.strip():
                    item.text = None
                if item.tail is not None and not item.tail.strip():
                    item.tail = None
            contracts.append(ET.tostring(pair, encoding="utf-8"))
    return contracts


def validate(path: Path, compare_with_load: bool = True) -> list[str]:
    errors: list[str] = []
    if path.name != EXPECTED:
        errors.append(f"filename must be {EXPECTED}")
    try:
        root = ET.parse(path).getroot()
    except (OSError, ET.ParseError) as exc:
        return errors + [f"cannot parse JMX: {exc}"]
    text = ET.tostring(root, encoding="unicode")

    try:
        tree = measured_tree(root)
    except ValueError as exc:
        errors.append(str(exc))
        tree = None
    if tree is not None:
        if len(tree.findall(".//HTTPSamplerProxy")) != 9:
            errors.append("measured Endurance group must contain exactly 9 HTTP samplers")
        if compare_with_load:
            try:
                reference = measured_tree(ET.parse(LOAD_PLAN).getroot())
                if sampler_contracts(tree) != sampler_contracts(reference):
                    errors.append("HTTP requests, correlation, or assertion trees differ from Load")
            except (OSError, ET.ParseError, ValueError) as exc:
                errors.append(f"cannot read Load functional reference: {exc}")

    for name in PROPERTIES:
        if name not in text:
            errors.append(f"missing required property {name}")
        if f"__P({name}," not in text:
            errors.append(f"property {name} is not read without a numeric fallback")
    if "load." in text:
        errors.append("Load runtime property remains in Endurance plan")
    for required in ("Bearer ${token}", "orderId", "data/scenario-c.local.csv"):
        if required not in text:
            errors.append(f"missing {required}")
    for node in root.findall(".//CSVDataSet"):
        props = {item.get("name"): (item.text or "") for item in node.findall("stringProp")}
        if props.get("recycle") != "false" or props.get("stopThread") != "true":
            errors.append("CSV must use recycle=false and stopThread=true")
    for listener in root.findall(".//ResultCollector"):
        if listener.get("enabled", "true") == "true":
            errors.append(f"GUI listener must be disabled: {listener.get('testname', 'unnamed')}")
    if "Test1234!" in text or "Admin123!" in text:
        errors.append("credential found in JMX")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jmx", nargs="?", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        fixture = """<jmeterTestPlan><hashTree><ThreadGroup testname="Measured Endurance - Scenario C"/><hashTree>
        <CSVDataSet><stringProp name="filename">data/scenario-c.local.csv</stringProp><stringProp name="recycle">false</stringProp><stringProp name="stopThread">true</stringProp></CSVDataSet>
        <HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/>
        <HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/>
        <HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/><HTTPSamplerProxy/><hashTree/>
        <HeaderManager><stringProp>Bearer ${token}</stringProp></HeaderManager><JSONPostProcessor><stringProp>orderId</stringProp></JSONPostProcessor>
        <stringProp>${__P(endurance.threads,)}</stringProp><stringProp>${__P(endurance.ramp_up_seconds,)}</stringProp>
        <stringProp>${__P(endurance.duration_seconds,)}</stringProp><stringProp>${__P(endurance.think_time_ms,)}</stringProp>
        <ResultCollector enabled="false"/></hashTree></hashTree></jmeterTestPlan>"""
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / EXPECTED
            path.write_text(fixture, encoding="utf-8")
            errors = validate(path, compare_with_load=False)
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
