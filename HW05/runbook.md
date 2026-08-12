# Scenario C JMeter Runbook

## 1. Verify JMeter

```bash
jmeter --version
```

Expected installed version: Apache JMeter 5.6.3. The official binary was SHA-512 verified before installation.

## 2. Start/reset the backend and provision users

Every backend start drops and reseeds the SQLite database. Provision the JMeter users immediately afterward:

```bash
USER_COUNT=<maximum-reviewed-threads> \
JMETER_USER_PASSWORD=<local-secret> \
scripts/start-backend-and-provision.sh
```

Optional variables include `BASE_URL`, `STUDENT_ID`, `OUTPUT_FILE`, `PRODUCT_ID`, `SEARCH_KEYWORD`, `QUANTITY`, and `SUT_BACKEND_DIR`.

The scripts:

- Wait for the product endpoint before provisioning.
- Generate deterministic emails `hw05-23127194-NNNN@eshop.local`.
- Register or safely reuse each account and verify login.
- Validate the selected product.
- Write `data/scenario-c.local.csv` with mode `600`.
- Fail without replacing the CSV if any account is unusable.

Never commit `JMETER_USER_PASSWORD` or `data/scenario-c.local.csv`. Set `USER_COUNT` to at least the maximum concurrent JMeter threads, not merely the average threads.

## 3. Final test-plan names

```text
tests/23127194_Load_20260812.jmx
tests/23127194_Stress_20260812.jmx
tests/23127194_Spike_20260812.jmx
```

All three plans must reuse the same Scenario C functional sequence. Only workload parameters and distinct listener/report views may differ.

## 4. JMeter data and correlation requirements

- CSV Data Set Config: `data/scenario-c.local.csv`.
- Do not recycle on EOF; stop the thread when data is exhausted.
- Extract JWT from login and send `Authorization: Bearer ${token}`.
- Extract `orderId` from checkout.
- Assert the fresh order is `pending` before cancellation.
- Cancel exactly `${orderId}` and verify it becomes `canceled` in user history.
- Separate HTTP checks from business assertions.
- Add reviewed think-time and workload values only after baseline evidence.

## 5. Non-GUI execution

Use the shape below after the `.jmx` plan is human-reviewed:

```bash
jmeter -n \
  -t tests/23127194_<ScenarioType>_20260812.jmx \
  -l results/raw/<scenario>/23127194_<ScenarioType>_20260812.jtl \
  -e -o results/html/<scenario>/23127194_<ScenarioType>_20260812
```

Use a clean output directory. Never edit the resulting `.jtl` manually.

## 6. Per-run evidence procedure

1. Restart the backend and provision a fresh pool sized for that plan.
2. Record the final plan filename and Git commit.
3. Start JMeter and the backend resource monitor in the same captured frame.
4. Execute the plan and retain its untouched `.jtl`.
5. Use the scenario's distinct listener/report view.
6. Capture resource and hardware evidence.
7. Classify observed failures as SUT, data, environment, or test-plan failures.
8. Record the residual canceled-order count; the next backend start will reset it.

## 7. Endurance and AI analysis

- Run endurance for approximately 10-15 minutes at a reviewed sustained load.
- Derive threshold numbers only from raw results and resource evidence.
- Give AI the untouched raw files, preserve its response, and verify every cited metric against the `.jtl`.
