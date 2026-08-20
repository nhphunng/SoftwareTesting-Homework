# FR-05 Postman runtime data and limitations

This folder contains setup/runtime preparation only. It contains no official execution result, PASS/FAIL evidence, screenshot, Newman report, or confirmed defect.

## Runtime setup prepared on 2026-08-20

SUT base URL verified: `http://localhost:3000`.

Important: `http://127.0.0.1:3000` currently reaches a different local Node process and returns 404 for `/api/products`; do not use it for this FR-05 run.

The controlled non-secret runtime values are stored in `FR05-runtime-data.json` and mirrored into `HW06-FR05-Local.postman_environment.json`.

Verified dataset representatives:

- matching keyword: `iPhone` → `iPhone 15 Pro Max`
- no-match keyword: `__NO_MATCH_23127194__`
- exact name: `iPhone 15 Pro Max`
- partial value: `iPhone 15`
- Unicode value: `Bàn` → `Bàn phím cơ Keychron Q1`
- lowercase/uppercase probes: `iphone` / `IPHONE`
- one-character probe: `i`
- A/B keywords: `iPhone` / `Samsung`
- non-name-only keyword: `camera` (present in Samsung description but not in a product name)
- null-byte baseline keyword required by HUMAN-FR05-044: `phone` → `iPhone 15 Pro Max`

## Authentication

A real admin login was verified through `/api/login`, and the returned token was verified by `/api/users/me` as role `admin`.

The real JWT is stored only in:

`postman/environment/HW06-FR05-Local.private.postman_environment.json`

That private environment is git-ignored. Do not copy the token into tracked reports or submission artifacts. Obtain a fresh token again before the official run if needed.

## Disposable mutation fixtures

Two dedicated products were created through the product API for the approved HUMAN state-history cases:

- HUMAN-FR05-046 rename fixture: ID `6`, name `HW06_FR05_RENAME_23127194_OLD`
- HUMAN-FR05-047 delete fixture: ID `7`, name `HW06_FR05_DELETE_23127194`

Both are disposable. `enableDestructiveStateTests=true` is now configured in the FR-05 runtime data because dedicated fixtures and a private admin token are available.

Expected mutation lifecycle for the official run:

1. HUMAN-FR05-046 renames ID 6 to `HW06_FR05_RENAME_23127194_NEW`.
2. HUMAN-FR05-047 deletes ID 7.
3. Cleanup/reset before a repeated official run must recreate/reset these fixtures instead of reusing stale state.

## Readiness limitation: Postman implementation must be synchronized

The finalized testcase source now contains replacement definitions for:

- HUMAN-FR05-043 — Structured query parameter injection
- HUMAN-FR05-044 — Encoded null-byte inside search value
- HUMAN-FR05-048 — Unsupported or malformed POST must not mutate products

However, the current Postman collection still contains the older 043/044/048 documentation/concurrency/burst implementations. Therefore these three cases are **BLOCKED — stale Postman implementation**, not runtime-data blocked.

Do not start the official Newman run until the collection is synchronized to those three approved replacement cases.

See `FR05-runtime-readiness.md` for the Step J readiness summary.
