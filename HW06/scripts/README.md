# HW06 Step K Utilities

These scripts keep the Step K execution evidence complete while minimizing the amount of raw Newman output that must be loaded into AI context.

## Run Step K

```bash
./scripts/run-step-k.sh FR05
./scripts/run-step-k.sh FR10
./scripts/run-step-k.sh FR16
```

Use `--dry-run` to verify file resolution and the Newman command without executing the collection:

```bash
./scripts/run-step-k.sh FR10 --dry-run
```

The runner expects the naming convention:

```text
postman/collection/HW06-<FR>-<Feature>.postman_collection.json
postman/environment/HW06-<FR>-Local.postman_environment.json
postman/environment/HW06-<FR>-Local.private.postman_environment.json   # preferred when present
postman/data/<FR>-runtime-data.json
```

Supported feature mapping:

```text
FR05 -> ProductSearch
FR10 -> CancelOrder
FR16 -> ImportProducts
```

Raw reports are written to `postman/newman/` and remain the official evidence source.

## Compact Newman summary

`extract-newman-summary.js` reads a Newman JSON reporter file and emits:

```text
postman/newman/<FR>-execution-summary.json
postman/newman/<FR>-execution-summary.md
```

The compact summary contains only the information normally needed for Step K / Gate G reasoning:

- testcase-ID count;
- request count;
- assertion totals/pass/fail;
- failed testcase IDs;
- failed assertions;
- method, URL, status and a short response preview for failures;
- `X-Student-Id` coverage;
- no Authorization/cookie/token values.

The AI workflow should read the compact summary first. Raw JSON/HTML/CLI evidence should only be opened when a particular failure needs deeper inspection.

You can also run the extractor independently:

```bash
node scripts/extract-newman-summary.js \
  postman/newman/FR05-official-report.json \
  postman/newman/FR05-execution-summary
```

## Failure behavior

Assertion failures are not hidden. Newman may return a non-zero exit code; the runner still extracts the compact summary when the JSON report exists and then returns the original Newman exit status so CI remains truthful.
