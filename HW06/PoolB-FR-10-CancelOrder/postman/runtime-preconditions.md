# FR-10 Cancel Order — Step J Runtime Test Data and Preconditions

Date: 2026-08-21  
Step J status: **READY**  
Official Newman execution: **NOT STARTED**

## Runtime endpoint

```text
http://localhost:3000
```

The active EShop backend process was verified as:

```text
/Users/nguyenhoangphihung/Document/eshop-sut/backend/server.js
```

A separate ChatGPT local-coder process also listens on port 3000 via another interface; process cwd inspection was used to distinguish the EShop SUT before fixture preparation.

## Real actors and authentication

A dedicated FR10 fixture set was created through the real API:

- User A: timestamped dedicated regular user
- User B: timestamped dedicated regular user
- Admin: documented SUT admin account

Real JWTs were obtained through `POST /api/login` and stored only in:

```text
postman/environment/HW06-FR10-Local.private.postman_environment.json
```

The private environment is excluded by `.gitignore`.

No token/password is stored in the tracked runtime manifest or this document.

## Fixture creation method

All 40 dedicated order fixtures are created through documented API paths:

```text
POST /api/register
POST /api/login
POST /api/checkout
PUT /api/admin/orders/:id/status
GET /api/orders/:id
GET /api/orders/my-orders
```

No order fixture was fabricated in the Postman environment.

Reusable setup script:

```bash
export FR10_ADMIN_PASSWORD='<documented local SUT admin password>'
./scripts/prepare-fr10-runtime.py
```

The script creates a fresh timestamped fixture set, generates random passwords for the dedicated User A/User B accounts, and intentionally does not run Newman. The admin password is supplied at runtime and is not hard-coded in the tracked script.

## Prepared state inventory

```text
PENDING:   28 dedicated orders
CONFIRMED:  7 dedicated orders
SHIPPING:   3 dedicated orders
DELIVERED:  1 dedicated order
CANCELED:   1 dedicated order
TOTAL:     40 dedicated orders
```

Each mutation-sensitive testcase/group has a dedicated order variable so an earlier cancellation does not destroy a later testcase's precondition.

Ownership distribution in the current fixture set:

```text
User A: 34 orders
User B:  6 orders
```

`GET /api/orders/my-orders` independently returned the same ownership counts.

## Verification results

The non-secret fixture manifest is stored at:

```text
PoolB-FR-10-CancelOrder/postman/runtime-fixture-manifest.json
```

Verification performed after setup:

```text
manifest orders:       40
database mismatches:    0
private env variables: 50
blank private env vars:  0
```

State distribution verified against the live SQLite database:

```text
pending:   28
confirmed:  7
shipping:   3
delivered:  1
canceled:   1
```

A positive nonexistent order ID was also selected and verified to return not-found behavior before use.

## Runtime files

### Private Postman environment

```text
postman/environment/HW06-FR10-Local.private.postman_environment.json
```

Contains real runtime values such as:

- User A / User B JWTs
- admin JWT
- User A / User B IDs
- tampered JWT
- Basic-auth characterization value
- all dedicated order IDs
- nonexistent order ID

This file is git-ignored.

### Runtime iteration data

```text
postman/data/FR10-runtime-data.json
```

Contains only non-secret execution metadata. One Newman iteration is used because testcase-specific IDs and tokens are supplied by the private environment.

### Public environment

```text
postman/environment/HW06-FR10-Local.postman_environment.json
```

Remains a safe skeleton and does not contain real runtime credentials.

## Testcase readiness

| Group | Readiness | Notes |
| --- | --- | --- |
| AI-FR10-001..010 | READY | Dedicated state/domain fixtures available. |
| AI-FR10-011 | READY — EXTERNAL RAW PATH | Requires the approved `curl --path-as-is` execution/evidence because Postman may normalize `//`. |
| AI-FR10-012..041 | READY | Required IDs/auth/state fixtures available. |
| AI-FR10-042 | READY — POST-RUN EVIDENCE | Representative request is implemented; final oracle is suite-wide verification against official Newman JSON. |
| HUMAN-FR10-043..048 | READY | Dedicated ownership/state fixtures and both user tokens available. |

## Reset and rerun strategy

FR10 contains irreversible transitions to `canceled`, so the official collection must not simply be rerun against the same mutated fixture set.

Before a new official run after the current set has been consumed:

```bash
export FR10_ADMIN_PASSWORD='<documented local SUT admin password>'
./scripts/prepare-fr10-runtime.py
```

This creates fresh timestamped users/orders and overwrites the private environment/runtime manifest with a new isolated set.

Old dedicated fixtures may be cleaned after evidence preservation. Cleanup must target only the IDs/users recorded in the fixture manifest; it must not delete unrelated SUT data.

## Step K dry-run verification

The reusable runner now resolves all required Step K inputs:

```text
collection = postman/collection/HW06-FR10-CancelOrder.postman_collection.json
environment = postman/environment/HW06-FR10-Local.private.postman_environment.json
data = postman/data/FR10-runtime-data.json
newman = /private/tmp/hw06-newman/node_modules/.bin/newman
```

`./scripts/run-step-k.sh FR10 --dry-run` succeeds and prints the real Newman command without executing the suite.

## Step J conclusion

```text
Runtime endpoint: READY
User A auth: READY
User B auth: READY
Admin setup auth: READY
Ownership fixtures: READY
PENDING fixtures: READY
CONFIRMED fixtures: READY
SHIPPING fixtures: READY
DELIVERED fixture: READY
CANCELED fixture: READY
Nonexistent ID: READY
Private environment: READY
Runtime data file: READY
Reset/recreate strategy: READY
Official execution: NOT STARTED
```

Step J is complete. The next workflow stage is Step K — real Postman/Newman execution, with AI-FR10-011 handled using the approved external raw-path command and AI-FR10-042 completed from the resulting Newman evidence.
