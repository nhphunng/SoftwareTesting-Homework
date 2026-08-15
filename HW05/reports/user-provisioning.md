# JMeter User Provisioning Verification

## Purpose

Provide isolated accounts for Scenario C because the backend cart is keyed by user ID and stored in process memory. Sharing one account across concurrent JMeter threads would cause cart interference.

## Reset behavior

Source inspection confirmed that `backend/database.js` drops and recreates `users`, `products`, `orders`, carts' related database state, coupons, categories, and coupon usage on every backend start. The in-memory cart is also recreated with the Node.js process.

Therefore, each performance phase must run provisioning immediately after backend start/reset.

## Automation

- `scripts/start-backend-and-provision.sh`: start backend, wait for readiness, then invoke provisioning.
- `scripts/provision-jmeter-users.sh`: validate the product, create or reuse deterministic users, verify each login, and atomically write the local JMeter CSV.

Required runtime values:

```text
USER_COUNT=<at least maximum concurrent threads>
JMETER_USER_PASSWORD=<local secret>
```

The generated file `data/scenario-c.local.csv` is Git-ignored and has mode `600`.

## Verification result

| Check | Result |
| --- | --- |
| Functional pool size | 5 users (verification only) |
| Email pattern | `hw05-23127194-NNNN@eshop.local` |
| First provisioning | `created=5`, `reused=0` |
| CSV rows | 6 including the header |
| CSV file mode | `600` |
| Git ignore | Confirmed by `git check-ignore` |
| Second backend reset | All prior generated users removed by database initialization |
| Re-provision after reset | `created=5`, `reused=0`; all login verifications passed |

The first restart verification exposed a transient post-registration login failure for one account. The script was corrected to retry login verification up to five times with a short delay and to fail without publishing a replacement CSV if verification never succeeds. The rerun passed.

Five users demonstrate that automation works; they do not define the final workload. Phase 2 must choose the maximum thread count from baseline evidence and provision at least that many users.

Human Review:
- Status: Pending human review
- Accepted:
- Modified:
- Removed:
- Added:
- Notes:
