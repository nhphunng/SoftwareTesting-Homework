#!/usr/bin/env python3
"""Generate the human-confirmed HW05 Scenario C Spike JMX from final Load."""

from __future__ import annotations

import copy
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]
SOURCE = ROOT / "tests" / "23127194_Load_20260812.jmx"
OUTPUT = ROOT / "tests" / "23127194_Spike_20260812.jmx"

STAGES = (
    {
        "key": "baseline",
        "label": "Baseline",
        "order": "01",
        "threads": "spike.baseline_threads",
        "duration": "spike.baseline_duration_seconds",
        "ramp": "spike.baseline_ramp_seconds",
    },
    {
        "key": "peak",
        "label": "Spike",
        "order": "02",
        "threads": "spike.peak_threads",
        "duration": "spike.peak_duration_seconds",
        "ramp": "spike.peak_ramp_seconds",
    },
    {
        "key": "recovery",
        "label": "Recovery",
        "order": "03",
        "threads": "spike.recovery_threads",
        "duration": "spike.recovery_duration_seconds",
        "ramp": "spike.recovery_ramp_seconds",
    },
)


def string_prop(node: ET.Element, name: str) -> ET.Element:
    found = node.find(f".//stringProp[@name='{name}']")
    if found is None:
        raise ValueError(f"missing {name} in Load source")
    return found


def paired_tree(container: ET.Element, node: ET.Element) -> ET.Element:
    children = list(container)
    index = children.index(node)
    if index + 1 >= len(children) or children[index + 1].tag != "hashTree":
        raise ValueError(f"missing paired hashTree for {node.tag}")
    return children[index + 1]


def remove_collectors(container: ET.Element) -> list[ET.Element]:
    collectors: list[ET.Element] = []
    children = list(container)
    index = 0
    while index < len(children):
        node = children[index]
        if node.tag == "ResultCollector":
            collectors.append(copy.deepcopy(node))
            container.remove(node)
            if index + 1 < len(children) and children[index + 1].tag == "hashTree":
                container.remove(children[index + 1])
            index += 2
            continue
        index += 1
    return collectors


def setup_script() -> str:
    required = ", ".join(
        f'"{name}"'
        for name in (
            "spike.baseline_threads",
            "spike.baseline_duration_seconds",
            "spike.baseline_ramp_seconds",
            "spike.peak_threads",
            "spike.peak_duration_seconds",
            "spike.peak_ramp_seconds",
            "spike.recovery_threads",
            "spike.recovery_duration_seconds",
            "spike.recovery_ramp_seconds",
        )
    )
    return f"""
String failMessage = "";
String[] requiredPositive = {{{required}}};
for (int index = 0; index < requiredPositive.length; index++) {{
    String name = requiredPositive[index];
    String value = props.getProperty(name);
    if (value == null || !value.matches("[1-9][0-9]*")) {{
        failMessage = "Missing or invalid -J" + name + "; expected a positive integer";
        break;
    }}
}}
String think = props.getProperty("spike.think_time_ms");
if (failMessage.length() == 0 && (think == null || !think.matches("[0-9]+"))) {{
    failMessage = "Missing or invalid -Jspike.think_time_ms; expected a non-negative integer";
}}
java.io.File csv = new java.io.File(System.getProperty("user.dir"), "data/scenario-c.local.csv");
int availableRows = 0;
if (failMessage.length() == 0 && !csv.isFile()) {{
    failMessage = "Missing data/scenario-c.local.csv; provision users after backend reset";
}}
if (failMessage.length() == 0) {{
    java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(csv), "UTF-8"));
    while (reader.readLine() != null) availableRows++;
    reader.close();
    availableRows = availableRows > 0 ? availableRows - 1 : 0;
    int baselineThreads = Integer.parseInt(props.getProperty("spike.baseline_threads"));
    int peakThreads = Integer.parseInt(props.getProperty("spike.peak_threads"));
    int recoveryThreads = Integer.parseInt(props.getProperty("spike.recovery_threads"));
    int requiredRows = Math.max(baselineThreads, Math.max(peakThreads, recoveryThreads));
    if (availableRows < requiredRows) {{
        failMessage = "CSV has " + availableRows + " users but maximum stage concurrency=" + requiredRows + "; require USER_COUNT >= maximum stage threads";
    }}
}}
if (failMessage.length() > 0) {{
    SampleResult.setSuccessful(false);
    SampleResult.setResponseCode("500");
    SampleResult.setResponseMessage(failMessage);
}} else {{
    SampleResult.setSuccessful(true);
    SampleResult.setResponseCode("200");
    SampleResult.setResponseMessage("Validated Spike properties against " + availableRows + " CSV rows");
}}
""".strip()


def deadline_sampler(stage: dict[str, str]) -> ET.Element:
    deadline_name = f"spike.{stage['key']}.deadline_ms"
    script = f"""
String deadlineName = "{deadline_name}";
long now = System.currentTimeMillis();
synchronized (props) {{
    String prior = props.getProperty(deadlineName);
    if (prior == null || Long.parseLong(prior) <= now) {{
        long deadline = now + (Long.parseLong(props.getProperty("{stage['duration']}")) * 1000L);
        props.setProperty(deadlineName, Long.toString(deadline));
    }}
}}
SampleResult.setSuccessful(true);
SampleResult.setResponseCode("200");
SampleResult.setResponseMessage("{stage['label']} stage deadline initialized");
""".strip()
    sampler = ET.Element(
        "JSR223Sampler",
        {
            "guiclass": "TestBeanGUI",
            "testclass": "JSR223Sampler",
            "testname": f"{stage['order']} {stage['label']} Stage - Initialize Deadline",
            "enabled": "true",
        },
    )
    for name, text in (
        ("scriptLanguage", "beanshell"),
        ("parameters", ""),
        ("filename", ""),
        ("cacheKey", "false"),
        ("script", script),
    ):
        child = ET.SubElement(sampler, "stringProp", {"name": name})
        child.text = text
    return sampler


def configure_stage(
    thread_group: ET.Element, stage_tree: ET.Element, stage: dict[str, str]
) -> None:
    thread_group.set(
        "testname", f"{stage['order']} {stage['label']} Stage - Scenario C"
    )
    string_prop(thread_group, "ThreadGroup.num_threads").text = (
        "${__P(" + stage["threads"] + ",)}"
    )
    string_prop(thread_group, "ThreadGroup.ramp_time").text = (
        "${__P(" + stage["ramp"] + ",)}"
    )
    string_prop(thread_group, "ThreadGroup.duration").text = (
        "${__P(" + stage["duration"] + ",)}"
    )

    csv = stage_tree.find(".//CSVDataSet")
    if csv is None:
        raise ValueError("Load source has no CSV Data Set Config")
    csv.set("testname", f"{stage['order']} {stage['label']} Stage - Dedicated Users")
    string_prop(csv, "shareMode").text = "shareMode.group"

    timer = stage_tree.find(".//ConstantTimer")
    if timer is None:
        raise ValueError("Load source has no Constant Timer")
    timer.set("testname", f"{stage['order']} {stage['label']} Stage - Think Time")
    string_prop(timer, "ConstantTimer.delay").text = "${__P(spike.think_time_ms,)}"

    controller = stage_tree.find(".//WhileController")
    if controller is None:
        raise ValueError("Load source has no deadline While Controller")
    controller.set(
        "testname", f"{stage['order']} {stage['label']} Stage - Start Complete Flows Before Deadline"
    )
    string_prop(controller, "WhileController.condition").text = (
        "${__BeanShell(System.currentTimeMillis() < Long.parseLong(props.getProperty("
        f'"spike.{stage["key"]}.deadline_ms"))' + ")}"
    )

    children = list(stage_tree)
    while_index = children.index(controller)
    stage_tree.insert(while_index, deadline_sampler(stage))
    stage_tree.insert(while_index + 1, ET.Element("hashTree"))

    prefix = f"{stage['order']} {stage['label']} | "
    for node in stage_tree.findall(".//TransactionController"):
        node.set("testname", prefix + node.get("testname", "Transaction"))
    for node in stage_tree.findall(".//HTTPSamplerProxy"):
        node.set("testname", prefix + node.get("testname", "HTTP"))


def main() -> int:
    if OUTPUT.exists():
        raise SystemExit(f"refusing to overwrite existing plan: {OUTPUT}")

    source_tree = ET.parse(SOURCE)
    source_root = source_tree.getroot()
    source_plan = source_root.find("./hashTree/TestPlan")
    if source_plan is None:
        raise ValueError("Load source is missing Test Plan")
    source_container = paired_tree(source_root.find("./hashTree"), source_plan)

    setup = source_container.find("./SetupThreadGroup")
    measured = source_container.find("./ThreadGroup")
    if setup is None or measured is None:
        raise ValueError("Load source must contain setup and measured Thread Groups")
    setup_tree = paired_tree(source_container, setup)
    measured_tree = paired_tree(source_container, measured)
    collectors = remove_collectors(measured_tree)

    new_root = ET.Element(
        "jmeterTestPlan", {"version": "1.2", "properties": "5.0", "jmeter": "5.6.3"}
    )
    root_tree = ET.SubElement(new_root, "hashTree")
    plan = copy.deepcopy(source_plan)
    plan.set("testname", "23127194 Spike 20260812 - Scenario C")
    string_prop(plan, "TestPlan.comments").text = (
        "Human-confirmed Phase 4 contract: serialized Baseline 10 threads/30 s, sudden Spike "
        "80 threads/60 s, Recovery 10 threads/30 s, each with 1 s ramp and 250 ms think-time. "
        "Per-stage acceptance: HTTP errors <= 1%, business success >= 99%, end-to-end p95 "
        "<= 250 ms, each transaction p95 <= 100 ms. Recovery end-to-end p95 must return "
        "to <= 1.5x this run's Baseline p95 within 20 s. Response Time Graph is the distinct "
        "Spike listener; raw JTL and HTML report remain authoritative. Stress found no breakpoint "
        "through 80 threads, so this tests resilience/recovery at the maximum tested concurrency, "
        "not a capacity ceiling."
    )
    serialized = plan.find("boolProp[@name='TestPlan.serialize_threadgroups']")
    if serialized is None:
        raise ValueError("Load source Test Plan has no serialization property")
    serialized.text = "true"
    arguments = plan.find(".//collectionProp[@name='Arguments.arguments']")
    if arguments is None:
        raise ValueError("Load source has no acceptance-criteria arguments")
    for name, value in (
        ("threshold.recovery_p95_multiplier", "1.5"),
        ("threshold.recovery_seconds", "20"),
    ):
        element = ET.SubElement(arguments, "elementProp", {"name": name, "elementType": "Argument"})
        ET.SubElement(element, "stringProp", {"name": "Argument.name"}).text = name
        ET.SubElement(element, "stringProp", {"name": "Argument.value"}).text = value
        ET.SubElement(element, "stringProp", {"name": "Argument.metadata"}).text = "="

    root_tree.append(plan)
    container = ET.SubElement(root_tree, "hashTree")

    setup_copy = copy.deepcopy(setup)
    setup_copy.set("testname", "Unmeasured Setup - Validate Spike Properties and CSV Capacity")
    setup_tree_copy = copy.deepcopy(setup_tree)
    setup_sampler = setup_tree_copy.find(".//JSR223Sampler")
    if setup_sampler is None:
        raise ValueError("Load source setup has no JSR223 sampler")
    setup_sampler.set("testname", "Validate required Spike properties and maximum CSV capacity")
    string_prop(setup_sampler, "script").text = setup_script()
    container.extend((setup_copy, setup_tree_copy))

    for stage in STAGES:
        group = copy.deepcopy(measured)
        group_tree = copy.deepcopy(measured_tree)
        configure_stage(group, group_tree, stage)
        container.extend((group, group_tree))

    response_graph = next(
        (item for item in collectors if item.get("enabled", "true") == "true"), None
    )
    disabled_tree = next(
        (item for item in collectors if item.get("guiclass") == "ViewResultsFullVisualizer"), None
    )
    if response_graph is None or disabled_tree is None:
        raise ValueError("Load source listeners are unavailable")
    response_graph.set("guiclass", "RespTimeGraphVisualizer")
    response_graph.set("testname", "Response Time Graph - Spike Listener")
    response_graph.set("enabled", "true")
    disabled_tree.set("testname", "View Results Tree - Debug Only - Disabled")
    disabled_tree.set("enabled", "false")
    container.extend((response_graph, ET.Element("hashTree"), disabled_tree, ET.Element("hashTree")))

    ET.indent(new_root, space="  ")
    ET.ElementTree(new_root).write(OUTPUT, encoding="UTF-8", xml_declaration=True)
    print(f"generated {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
