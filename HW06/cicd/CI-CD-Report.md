# HW06 CI/CD Report

Date: 2026-08-21
Student ID: `23127194`
Status: **P11 COMPLETE**

## 1. Pipeline architecture

```text
Git push on branch hw06
        ↓
Checkout homework repository
        ↓
Checkout public EShop SUT (ttbhanh/eshop-sut)
        ↓
Setup Node.js + npm ci
        ↓
Start backend on port 3000
        ↓
Wait until GET /api/products is reachable
        ↓
Install Newman + HTMLExtra reporter
        ↓
Resolve controlled CI mode from HW06/cicd/ci-mode.txt
        ↓
Run controlled Postman/Newman CI demonstration suite
        ↓
Verify exact X-Student-Id and pass/one-fail invariant
        ↓
Upload CLI + JSON + HTML + JUnit reports
```

Workflow file:

- `.github/workflows/hw06-api-tests.yml`

Controlled CI Postman artifacts:

- `HW06/cicd/postman/HW06-CI-Demo.postman_collection.json`
- `HW06/cicd/postman/HW06-CI-Pass.postman_environment.json`
- `HW06/cicd/postman/HW06-CI-OneFail.postman_environment.json`
- `HW06/cicd/verify-ci-demo.mjs`
- `HW06/cicd/ci-mode.txt`

## 2. Separation from official Step K evidence

The CI demonstration suite is intentionally separate from the official FR05/FR10/FR16 Step K suites.

Reason: the official Step K suites contain real assertion failures that support seven confirmed SUT defects. Rewriting or suppressing those failures to obtain a green CI sample would falsify execution evidence.

The CI suite therefore uses deterministic, non-destructive checks from the same three APIs:

- FR05: deterministic product-search no-match returns an empty JSON array;
- FR10: cancellation of a guaranteed nonexistent order is rejected;
- FR16: an empty import batch is rejected;
- setup: default admin authentication.

Every CI request is forced by collection-level pre-request script to carry:

```text
X-Student-Id: 23127194
```

## 3. Required Run A — All Passing

Commit:

```text
06cd7d9b544a3d0ee9d8c5d19e5d00f1af4bba06
ci(hw06): add all-pass Newman CI demonstration
```

GitHub Actions run:

- https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492084678
- Conclusion: **SUCCESS**

Verified Newman result:

```text
mode=pass
requests=4
assertions=12
failed=0
sid=4/4
CI_DEMO_VERIFICATION=PASS
```

Evidence:

- `HW06/cicd/screenshots/run-a-all-pass.png`
- `HW06/cicd/evidence/run-a/github-actions.log`
- downloaded GitHub artifact under `HW06/cicd/evidence/run-a/hw06-newman-pass-1/`

## 4. Required Run B — Exactly One Intentional Failure

Commit:

```text
b564ce2229ada6f4c14a13491eaafd37086b6068
ci(hw06): demonstrate exactly one intentional Newman failure
```

GitHub Actions run:

- https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492204368
- Conclusion: **FAILURE — INTENTIONAL CI DEMONSTRATION**

Verified Newman result before the pipeline was intentionally marked red:

```text
mode=one-fail
requests=4
assertions=13
failed=1
sid=4/4
CI_DEMO_VERIFICATION=PASS
```

The one and only failing assertion was:

```text
CI-DEMO-ONLY | intentional single failure
```

Its expectation is deliberately wrong:

```text
expected 'actual' to deeply equal 'intentionally-wrong-expected'
```

The workflow then explicitly marks the pipeline red with this message:

```text
Intentional CI demonstration: exactly one Newman testcase assertion was verified as failing.
This red pipeline is NOT evidence of a new SUT defect.
```

Evidence:

- `HW06/cicd/screenshots/run-b-one-fail.png`
- `HW06/cicd/evidence/run-b/github-actions.log`
- downloaded GitHub artifact under `HW06/cicd/evidence/run-b/hw06-newman-one-fail-2/`

## 5. Restore after intentional failure

After Run B, `ci-mode.txt` was restored to `pass`.

Restore commit:

```text
582811c82d7239c91a819d938e4dd36696423467
ci(hw06): restore passing CI demonstration mode
```

Restore GitHub Actions run:

- https://github.com/nhphunng/SoftwareTesting-Homework/actions/runs/32492332236
- Conclusion: **SUCCESS**

Therefore branch `hw06` is not left in intentional-failure mode.

## 6. YAML explanation

The workflow performs these key controls:

1. Uses a clean Ubuntu GitHub runner.
2. Checks out the homework repository and the public EShop SUT separately.
3. Installs backend dependencies with `npm ci`.
4. Starts the real SUT and waits for a real API response before testing.
5. Installs Newman and HTMLExtra.
6. Resolves `pass` versus `one-fail` from a committed control file.
7. Captures Newman exit code instead of hiding it.
8. Verifies from raw Newman JSON that every request contains the exact student header.
9. Requires zero failures in pass mode.
10. Requires exactly one failure, specifically `CI-DEMO-ONLY`, in one-fail mode.
11. Uploads Newman CLI, JSON, HTML and JUnit evidence even when the job is intentionally red.

## 7. Environment

GitHub-hosted environment:

- Runner: `ubuntu-latest`
- Node.js requested: 20
- SUT: public repository `ttbhanh/eshop-sut`
- Backend URL: `http://127.0.0.1:3000`
- Newman installed during workflow
- No local private JWT is uploaded to CI
- Admin JWT is generated at runtime by authenticating against the clean CI SUT

## 8. Limitations / observations

- GitHub emitted a warning that some JavaScript actions targeting Node.js 20 are being forced to Node.js 24 by the Actions runtime. This did not cause either demonstration to malfunction.
- The CI demonstration is intentionally small and deterministic. It is not a replacement for the official full Step K suites.
- Official Step K product-defect failures remain unchanged and continue to be the source of truth for defect evidence.
- The one-fail assertion is explicitly artificial and must never be reported as an SUT defect.

## 9. P11 conclusion

P11 satisfies the required CI/CD evidence:

- [x] Pipeline YAML committed
- [x] Real all-pass GitHub Actions run
- [x] Real one-fail GitHub Actions run
- [x] Exactly one controlled Newman assertion failure in Run B
- [x] `X-Student-Id: 23127194` verified on every CI request
- [x] Newman reports uploaded as GitHub artifacts
- [x] Real GitHub Actions screenshots captured
- [x] Run URLs recorded
- [x] CI/CD report created
- [x] Intentional failure restored to pass afterward
