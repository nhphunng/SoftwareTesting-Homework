#!/usr/bin/env python3
"""Validate the structural contract of the final HW05 Spike JMX."""

import argparse
import copy
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path


EXPECTED = "23127194_Spike_20260812.jmx"
LOAD_PLAN = Path(__file__).resolve().parents[4] / "tests" / "23127194_Load_20260812.jmx"
STAGES = ("Baseline", "Spike", "Recovery")
REQUIRED = (
    "Bearer ${token}",
    "data/scenario-c.local.csv",
    "Response Time Graph",
    "token",
    "orderId",
)


def paired_tree(container: ET.Element, node: ET.Element) -> ET.Element | None:
    children = list(container)
    index = children.index(node)
    if index + 1 < len(children) and children[index + 1].tag == "hashTree":
        return children[index + 1]
    return None


def sampler_contracts(container: ET.Element) -> list[bytes]:
    def strip_layout_whitespace(node: ET.Element) -> None:
        for item in node.iter():
            if item.text is not None and not item.text.strip():
                item.text = None
            if item.tail is not None and not item.tail.strip():
                item.tail = None

    contracts: list[bytes] = []
    for parent in container.iter("hashTree"):
        for sampler in parent.findall("HTTPSamplerProxy"):
            assertion_tree = paired_tree(parent, sampler)
            if assertion_tree is None:
                continue
            sampler_copy = copy.deepcopy(sampler)
            sampler_copy.set("testname", "STAGE-INDEPENDENT-LABEL")
            pair = ET.Element("pair")
            pair.extend((sampler_copy, copy.deepcopy(assertion_tree)))
            strip_layout_whitespace(pair)
            contracts.append(ET.tostring(pair, encoding="utf-8"))
    return contracts


def load_contracts() -> list[bytes]:
    root = ET.parse(LOAD_PLAN).getroot()
    group = root.find(".//ThreadGroup")
    if group is None:
        raise ValueError("Load reference has no measured Thread Group")
    for container in root.findall(".//hashTree"):
        tree = paired_tree(container, group) if group in list(container) else None
        if tree is not None:
            return sampler_contracts(tree)
    raise ValueError("Load reference has no paired measured tree")


def validate(path: Path, compare_with_load: bool = True) -> list[str]:
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
    reference_contracts: list[bytes] = []
    if compare_with_load:
        try:
            reference_contracts = load_contracts()
        except (OSError, ET.ParseError, ValueError) as exc:
            errors.append(f"cannot read Load functional reference: {exc}")
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
        if compare_with_load and sampler_contracts(stage_trees[0]) != reference_contracts:
            errors.append(
                f"{stage} HTTP requests, correlation, or assertion trees differ from Load"
            )
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
