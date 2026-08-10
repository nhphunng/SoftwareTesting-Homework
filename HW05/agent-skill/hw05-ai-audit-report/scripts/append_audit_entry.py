#!/usr/bin/env python3
import argparse
import hashlib
from pathlib import Path

MARKER = "<!-- AUDIT_ROWS -->"


def read_text(path_string: str) -> tuple[Path, str, str]:
    path = Path(path_string)
    content = path.read_text(encoding="utf-8")
    digest = hashlib.sha256(content.encode("utf-8")).hexdigest()
    return path, content, digest


def cell(value: str) -> str:
    return value.replace("|", "\\|").replace("\r\n", "\n").replace("\r", "\n").replace("\n", "<br>")


def main() -> None:
    parser = argparse.ArgumentParser(description="Append one immutable-style HW05 AI audit row.")
    parser.add_argument("--report", required=True)
    parser.add_argument("--artifact", required=True)
    parser.add_argument("--tool", required=True)
    parser.add_argument("--time", required=True)
    parser.add_argument("--prompt-file", required=True)
    parser.add_argument("--output-file", required=True)
    parser.add_argument("--verdict", required=True, choices=("VALID", "INVALID", "INCOMPLETE"))
    parser.add_argument("--reasoning", required=True)
    parser.add_argument("--student-fix", required=True)
    args = parser.parse_args()

    report_path = Path(args.report)
    report = report_path.read_text(encoding="utf-8")
    if report.count(MARKER) != 1:
        raise SystemExit(f"Report must contain exactly one {MARKER} marker")

    prompt_path, prompt, prompt_hash = read_text(args.prompt_file)
    output_path, output, output_hash = read_text(args.output_file)
    identity = (
        f"**Artifact:** `{args.artifact}`<br><br>**Tool:** {args.tool}<br><br>"
        f"**Time:** {args.time}<br><br>**Prompt file:** `{prompt_path}` "
        f"(SHA-256 `{prompt_hash}`)<br><br>**Exact prompt:** {cell(prompt)}"
    )
    generated = (
        f"**Output file:** `{output_path}` (SHA-256 `{output_hash}`)<br><br>"
        f"**Exact output:** {cell(output)}"
    )
    row = "| " + " | ".join((
        identity,
        generated,
        args.verdict,
        cell(args.reasoning),
        cell(args.student_fix),
    )) + " |\n"
    report_path.write_text(report.replace(MARKER, row + MARKER), encoding="utf-8")


if __name__ == "__main__":
    main()
