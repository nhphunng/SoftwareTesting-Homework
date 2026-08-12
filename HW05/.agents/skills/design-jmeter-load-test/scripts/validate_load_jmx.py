#!/usr/bin/env python3
"""Validate the structural contract of the HW05 Scenario C Load JMX."""

from __future__ import annotations

import argparse
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path


EXPECTED_NAME = "23127194_Load_20260812.jmx"
EXPECTED_FLOW = [
    ("POST", "/api/login"),
    ("GET", "/api/products"),
    ("GET", "/api/products/${product_id}"),
    ("POST", "/api/cart"),
    ("GET", "/api/cart"),
    ("POST", "/api/checkout"),
    ("GET", "/api/orders/${orderId}"),
    ("PUT", "/api/orders/${orderId}/cancel"),
    ("GET", "/api/orders/my-orders"),
]
REQUIRED_PROPERTIES = {
    "ThreadGroup.num_threads": "__P(load.threads,)",
    "ThreadGroup.ramp_time": "__P(load.ramp_up_seconds,)",
    "ThreadGroup.duration": "__P(load.duration_seconds,)",
    "ConstantTimer.delay": "__P(load.think_time_ms,)",
}


def prop(element: ET.Element, name: str) -> str:
    node = element.find(f".//stringProp[@name='{name}']")
    return (node.text or "").strip() if node is not None else ""


def validate(path: Path) -> list[str]:
    errors: list[str] = []
    if path.name != EXPECTED_NAME:
        errors.append(f"filename must be {EXPECTED_NAME}")
    try:
        tree = ET.parse(path)
    except (ET.ParseError, OSError) as exc:
        return errors + [f"cannot parse JMX: {exc}"]

    root = tree.getroot()
    if root.tag != "jmeterTestPlan":
        errors.append("root element must be jmeterTestPlan")

    xml_text = ET.tostring(root, encoding="unicode")
    for forbidden in ("Test1234!", "Admin123!", "REPLACE_WITH_PASSWORD"):
        if forbidden in xml_text:
            errors.append("tracked JMX contains a credential or credential placeholder")
            break

    thread_groups = root.findall(".//ThreadGroup")
    if len(thread_groups) != 1:
        errors.append("expected exactly one measured ThreadGroup")

    for name, expected_fragment in REQUIRED_PROPERTIES.items():
        values = [
            (node.text or "").strip()
            for node in root.findall(f".//stringProp[@name='{name}']")
        ]
        if not any(expected_fragment in value for value in values):
            errors.append(f"missing reviewed runtime property {expected_fragment}")

    csv_nodes = root.findall(".//CSVDataSet")
    if len(csv_nodes) != 1:
        errors.append("expected exactly one CSV Data Set Config")
    else:
        csv = csv_nodes[0]
        if not prop(csv, "filename").endswith("data/scenario-c.local.csv"):
            errors.append("CSV filename must target data/scenario-c.local.csv")
        if prop(csv, "recycle").lower() != "false":
            errors.append("CSV recycle must be false")
        if prop(csv, "stopThread").lower() != "true":
            errors.append("CSV stopThread must be true")

    actual_flow: list[tuple[str, str]] = []
    for sampler in root.findall(".//HTTPSamplerProxy"):
        actual_flow.append(
            (
                prop(sampler, "HTTPSampler.method").upper(),
                prop(sampler, "HTTPSampler.path").split("?", 1)[0],
            )
        )
    if actual_flow != EXPECTED_FLOW:
        errors.append(f"HTTP sampler flow differs from Scenario C: {actual_flow!r}")

    ref_names = {
        prop(node, "JSONPostProcessor.referenceNames")
        for node in root.findall(".//JSONPostProcessor")
    }
    for required in ("token", "orderId"):
        if required not in ref_names:
            errors.append(f"missing JSON extraction for {required}")

    if "Bearer ${token}" not in xml_text:
        errors.append("missing Authorization: Bearer ${token}")

    assertion_names = " ".join(
        node.get("testname", "").lower()
        for node in root.iter()
        if node.tag in {"ResponseAssertion", "JSR223Assertion", "JSONPathAssertion"}
    )
    for state in ("pending", "canceled"):
        if state not in assertion_names:
            errors.append(f"missing named business assertion for {state}")

    for listener in root.findall(".//ResultCollector"):
        if (
            listener.get("guiclass") == "ViewResultsFullVisualizer"
            and listener.get("enabled", "true").lower() == "true"
        ):
            errors.append("View Results Tree must be disabled for measured runs")

    return errors


def self_test() -> int:
    samplers = "".join(
        f"<HTTPSamplerProxy><stringProp name='HTTPSampler.method'>{method}</stringProp>"
        f"<stringProp name='HTTPSampler.path'>{path}</stringProp></HTTPSamplerProxy>"
        for method, path in EXPECTED_FLOW
    )
    valid = f"""<jmeterTestPlan><hashTree><ThreadGroup>
      <stringProp name='ThreadGroup.num_threads'>${{__P(load.threads,)}}</stringProp>
      <stringProp name='ThreadGroup.ramp_time'>${{__P(load.ramp_up_seconds,)}}</stringProp>
      <stringProp name='ThreadGroup.duration'>${{__P(load.duration_seconds,)}}</stringProp>
    </ThreadGroup><CSVDataSet><stringProp name='filename'>data/scenario-c.local.csv</stringProp>
      <stringProp name='recycle'>false</stringProp><stringProp name='stopThread'>true</stringProp>
    </CSVDataSet><ConstantTimer><stringProp name='ConstantTimer.delay'>${{__P(load.think_time_ms,)}}</stringProp></ConstantTimer>
    {samplers}
    <JSONPostProcessor><stringProp name='JSONPostProcessor.referenceNames'>token</stringProp></JSONPostProcessor>
    <JSONPostProcessor><stringProp name='JSONPostProcessor.referenceNames'>orderId</stringProp></JSONPostProcessor>
    <HeaderManager><stringProp name='Header.value'>Bearer ${{token}}</stringProp></HeaderManager>
    <ResponseAssertion testname='Order is pending'/><JSR223Assertion testname='Same order is canceled'/>
    <ResultCollector guiclass='ViewResultsFullVisualizer' enabled='false'/>
    </hashTree></jmeterTestPlan>"""
    with tempfile.TemporaryDirectory() as directory:
        good = Path(directory) / EXPECTED_NAME
        good.write_text(valid, encoding="utf-8")
        if validate(good):
            print("self-test failed: valid fixture was rejected")
            return 1
        bad = Path(directory) / "bad.jmx"
        bad.write_text("<invalid/>", encoding="utf-8")
        if not validate(bad):
            print("self-test failed: invalid fixture was accepted")
            return 1
    print("self-test passed")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jmx", nargs="?", type=Path)
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    if args.jmx is None:
        parser.error("provide a JMX path or --self-test")
    errors = validate(args.jmx)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"PASS: {args.jmx}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
