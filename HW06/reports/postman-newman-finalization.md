# P10 — Finalize Postman / Newman

Date: 2026-08-21  
Status: **COMPLETE**

## Scope

P10 consolidates and validates the final Postman/Newman execution artifacts for the three selected HW06 APIs. It does not rerun the SUT or rewrite existing runtime outcomes.

## Final artifact inventory

All three features have:

- a Postman collection;
- a public environment with no live JWT literal;
- a runtime-data JSON file;
- a private runtime environment that is git-ignored;
- real Newman CLI evidence;
- real Newman JSON evidence;
- real Newman HTML report;
- real Newman JUnit/XML report;
- compact JSON and Markdown execution summaries.

## Final execution evidence

| Feature | IDs executed | Requests | Assertions | Passed | Failed | `X-Student-Id: 23127194` |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| FR05 | 47 | 62 | 142 | 138 | 4 | 62/62 |
| FR10 | 48 | 96 | 275 | 269 | 6 | 96/96 |
| FR16 | 46 | 195 | 388 | 342 | 46 | 195/195 |
| **Total** | — | **353** | **805** | **749** | **56** | **353/353** |

These are real Step K outcomes. Failed assertions are retained because they support genuine bug analysis; P10 does not convert them into PASS results.

## Student header verification

Every collection has a collection-level pre-request script that upserts the exact assignment header:

```text
X-Student-Id: 23127194
```

The official Newman evidence independently confirms an exact value match on all 353 observed requests across the three API runs.

Some collection items also display `{{studentId}}`; this is not the evidence oracle. The collection-level pre-request script enforces the fixed value before transmission, and the Newman report records the transmitted header value.

## Credential safety

Static validation found:

- no JWT-like literal in any public collection;
- no JWT-like literal in any public Postman environment;
- all three `.private.postman_environment.json` files are git-ignored.

Private environments remain local runtime files and must not be treated as submission/public credential artifacts.

## FR16 execution boundary

FR16 contains 57 testcase records, but only 46 were runtime-ready for faithful Newman execution. The remaining 11 cases are explicitly `NOT EXECUTED — BLOCKED`, not PASS/FAIL. P10 preserves that distinction.

## Postman/Newman features evidenced

- collection-level pre-request scripts;
- variables and runtime environments;
- mandatory header injection;
- Newman iteration-data files (`-d`);
- test scripts and persistence/semantic oracles;
- before/after helper requests;
- response JSON parsing/characterization;
- `pm.sendRequest()` helpers/concurrency where applicable;
- multiple Newman reporters: CLI, JSON, HTMLExtra, JUnit.

## Validation

Command:

```bash
node scripts/validate-postman-newman.mjs
```

Result:

```text
FR05: OK | IDs=47 requests=62 assertions=142 failed=4 SID=62/62
FR10: OK | IDs=48 requests=96 assertions=275 failed=6 SID=96/96
FR16: OK | IDs=46 requests=195 assertions=388 failed=46 SID=195/195
TOTAL: requests=353 assertions=805 failedAssertions=56
P10_VALIDATION=PASS
```

This is static/evidence validation only. No new SUT execution was performed during P10.

## P10 conclusion

**P10 COMPLETE — Postman/Newman artifacts are finalized and ready to be consumed by P11 CI/CD integration.**

The next phase must preserve truthful test outcomes. P11 may create an intentionally controlled all-pass demonstration and a one-fail demonstration for CI/CD evidence, but those runs must be clearly separated from the official Step K product-defect evidence above.
