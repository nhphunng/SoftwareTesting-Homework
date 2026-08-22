# HW06 Postman / Newman Final Package

Status: **P10 FINALIZED**  
Student ID header: `X-Student-Id: 23127194`

## Collections

| Feature | Collection | Public environment | Runtime data |
| --- | --- | --- | --- |
| FR05 Product Search | `collection/HW06-FR05-ProductSearch.postman_collection.json` | `environment/HW06-FR05-Local.postman_environment.json` | `data/FR05-runtime-data.json` |
| FR10 Cancel Order | `collection/HW06-FR10-CancelOrder.postman_collection.json` | `environment/HW06-FR10-Local.postman_environment.json` | `data/FR10-runtime-data.json` |
| FR16 Import Products | `collection/HW06-FR16-ImportProducts.postman_collection.json` | `environment/HW06-FR16-Local.postman_environment.json` | `data/FR16-runtime-data.json` |

Private runtime environments use the same naming with `.private` and are intentionally git-ignored because they may contain live JWTs. They are runtime-only artifacts and must not be included as public credentials.

## Official Newman evidence

Each feature has the following real Step K outputs under `newman/`:

- `<FR>-official-cli.txt`
- `<FR>-official-report.json`
- `<FR>-official-report.html`
- `<FR>-official-report.xml`
- `<FR>-execution-summary.json`
- `<FR>-execution-summary.md`

The raw Newman JSON/HTML/CLI artifacts are the execution source of truth. Compact execution summaries are derived from the raw JSON for review and AI consumption.

## Official execution totals

| Feature | Testcase IDs executed | Requests | Assertions | Passed | Failed | Student header |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR05 | 47 | 62 | 142 | 138 | 4 | 62/62 |
| FR10 | 48 | 96 | 275 | 269 | 6 | 96/96 |
| FR16 | 46 | 195 | 388 | 342 | 46 | 195/195 |
| **Total** | — | **353** | **805** | **749** | **56** | **353/353** |

Newman failures above are preserved intentionally because they are real execution evidence. They must not be normalized to all-pass results. Confirmed defects are documented separately in each feature's `bugs/` directory.

FR16 has 11 documented testcase records that were **NOT EXECUTED — BLOCKED** because a faithful CSV transport, safe DB-error trigger, logout/revocation endpoint, or role-promotion endpoint was unavailable. They are neither PASS nor FAIL.

## Postman features used

Across the three collections, the implementation demonstrates:

- collection-level pre-request scripts;
- exact mandatory `X-Student-Id` injection before requests;
- collection/environment/local variables;
- runtime private environments for credentials;
- runtime data files supplied through Newman `-d` / `--iteration-data`;
- test scripts and semantic/persistence assertions;
- dynamic variables where applicable;
- response JSON parsing and characterization;
- helper requests for before/after persistence checks;
- `pm.sendRequest()` for cross-request helpers/concurrency where needed;
- HTML, JSON, CLI, and JUnit Newman reporters.

## Runner

Use the shared runner:

```bash
./scripts/run-step-k.sh FR05 --dry-run
./scripts/run-step-k.sh FR10 --dry-run
./scripts/run-step-k.sh FR16 --dry-run
```

A real rerun may mutate the SUT and can invalidate prepared fixtures. Re-run the corresponding Step J preparation first whenever a feature's runtime fixture documentation requires it.

P10 static/final evidence validation:

```bash
node scripts/validate-postman-newman.mjs
```

This verifies required files, public-artifact secret safety, exact student-header enforcement, and Newman evidence header coverage without rerunning the SUT.
