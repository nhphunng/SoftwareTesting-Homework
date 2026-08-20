# API 2 — FR-10 Cancel Order — AI-Generated Test Cases

## Step F status

```text
API: PUT /api/orders/:id/cancel
Source: AI
AI-generated testcase count: 42
Required minimum: >=35
Schema/response checkpoint: APPROVED
Human Audit Status: COMPLETE — 36 initially VALID / 6 initially INCOMPLETE / 0 INVALID; all 42 approved after correction/re-review
Execution Status: NOT EXECUTED
Required per-request header: X-Student-Id: 23127194
```

## Provenance and review rules

- Every testcase in this artifact has `Source = AI`.
- `VALID`, `INVALID`, and `INCOMPLETE` are **Step G human audit** labels. The original audit produced 36 VALID / 0 INVALID / 6 INCOMPLETE. The six original `INCOMPLETE` labels are preserved for audit provenance; their corrected versions were explicitly human re-reviewed and approved on 2026-08-20.
- `UNRESOLVED` and `CHARACTERIZATION` are deliberate where the contract does not define exact HTTP status/body/schema.
- State transition/state preservation is the primary FR-10 oracle; follow-up `GET /api/orders/:id` should verify before/after state when runtime-ready.
- Cross-user cancellation is a **risk-based authorization expectation approved at Gate A**, not direct FR-10 wording.
- Expired-token and concurrency cases are intentionally not included in the mandatory 42 because runtime reproducibility/determinism is not yet guaranteed; they remain optional candidates from prior analysis.

## Step G human audit summary

| Label | Count | Case IDs |
| --- | ---: | --- |
| VALID | 36 | AI-FR10-001..003, 005..010, 013..016, 018..037, 039..041 |
| INCOMPLETE | 6 | AI-FR10-004, 011, 012, 017, 038, 042 |
| INVALID | 0 | — |

The six `INCOMPLETE` cases below preserve their **original human audit decision**. Their `Corrected Test` fields contain deterministic, reproducible corrections. The reviewer explicitly approved all six corrections on 2026-08-20, so all 42 AI-generated cases are now implementation-ready while the original audit labels remain unchanged for provenance.

## Correction status for originally INCOMPLETE cases

| Case IDs | Original Human Audit | Correction Status |
| --- | --- | --- |
| AI-FR10-004, 011, 012, 017, 038, 042 | INCOMPLETE | VALID — HUMAN RE-REVIEW APPROVED |

## Coverage summary

| Coverage | Count |
| --- | ---: |
| Functional | 4 |
| Domain | 8 |
| Boundary | 6 |
| State/Sequence | 9 |
| Security | 11 |
| Schema | 4 |
| **Total** | **42** |
| Required | >=35 |

## Coverage source traceability

- Requirements: `../analysis/requirements.md`
- Domain partitions: `../analysis/domain-partitions.md`
- State/sequence model: `../analysis/state-transitions.md`
- Security model: `../analysis/security.md`
- Schema/response model: `../analysis/schema.md`

---

## AI-FR10-001 — Own pending order — canonical cancel

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | FR-10/FR-20; ID-01; ST-01 |
| Category | Functional |
| Preconditions | User A valid JWT; dedicated User A order in pending |
| Input | PUT /api/orders/{pendingOwnId}/cancel; no body |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify pre-state pending; send cancel; fetch order again. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Cancellation is accepted semantically and the target order becomes canceled. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Authenticated owner performs allowed transition. |
| State Before | pending |
| State After | canceled |
| AI Rationale | Covers functional behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Preconditions, input, execution steps, and the State Before/After oracle are complete, clear, and independently reproducible. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-002 — Own confirmed order — canonical cancel

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | FR-10/FR-20; ID-02; ST-02 |
| Category | Functional |
| Preconditions | User A valid JWT; dedicated User A order in confirmed |
| Input | PUT /api/orders/{confirmedOwnId}/cancel; no body |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify pre-state confirmed; send cancel; fetch order again. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Cancellation is accepted semantically and the target order becomes canceled. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Authenticated owner performs allowed transition. |
| State Before | confirmed |
| State After | canceled |
| AI Rationale | Covers functional behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The scenario is clear, the confirmed→canceled state oracle is explicit, and it aligns with FR-10/ST-02. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-003 — Semantic boundary — confirmed allowed vs shipping rejected

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | FR-10 semantic boundary; CROSS-02/03 |
| Category | Functional |
| Preconditions | Two otherwise comparable User A orders: one confirmed, one shipping |
| Input | Cancel confirmed order, then cancel shipping order |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify both pre-states; execute both cancel attempts; fetch both orders. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Confirmed order becomes canceled; shipping order remains shipping and its cancel is rejected. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | Same authenticated owner; isolates state boundary. |
| State Before | confirmed + shipping |
| State After | canceled + shipping |
| AI Rationale | Covers functional behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The testcase combines two branches (confirmed allowed vs shipping rejected) to compare the state boundary. It remains executable and assessable, although splitting it into two atomic cases later would make failure isolation easier. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-004 — Canonical request shape and mandatory student header

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-01; QUERY-01; CT-01; SID-01 |
| Category | Functional |
| Preconditions | User A valid JWT; own pending order |
| Input | No body; no query; no Content-Type requirement; X-Student-Id: 23127194 |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send canonical cancel and verify outgoing student header plus final state. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Canonical request obeys FR-10; official request carries exact project header. |
| Expected Schema | UNRESOLVED BY DESIGN |
| Security Expectation | No negative SUT behavior inferred from student header. |
| State Before | pending |
| State After | canceled |
| AI Rationale | Covers functional behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The step 'verify outgoing student header' does not specify how the actually transmitted request will be captured (for example, Newman JSON evidence or Postman Console), so it is not independently reproducible as written. It also overlaps in purpose with AI-FR10-042. |
| Corrected Test | Scope this case to one concrete canonical request: execute AI-FR10-001 with no body, no query string, and no explicit Content-Type. In the official Newman JSON report, locate the execution for AI-FR10-001 and assert that its recorded request headers contain exactly `X-Student-Id: 23127194`. Then verify that the same order changed from `pending` to `canceled`. AI-FR10-042 remains the suite-wide header-evidence case; this case verifies the header on one canonical request only. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-005 — Non-existing plausible order ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-07; PRES-06 |
| Category | Domain |
| Preconditions | User A valid JWT; controlled known orders recorded before test |
| Input | PUT /api/orders/{nonExistingId}/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Record known order states; send request; verify known orders unchanged. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No real order is mutated; response status/body are runtime characterization. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Malformed/non-existing targeting must not affect unrelated resources. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The domain testcase is clear; the precondition that known orders are recorded before the test is sufficient to establish the oracle that no unrelated resource is affected. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-006 — Order ID zero

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-08 |
| Category | Domain |
| Preconditions | User A valid JWT; known fixtures |
| Input | PUT /api/orders/0/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no known order changed. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No unintended order mutation; exact response is unresolved. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Parser/coercion must not retarget another order. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Input, oracle, and steps are clear for the ID=0 boundary case. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-007 — Negative order ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-09 |
| Category | Domain |
| Preconditions | User A valid JWT; known fixtures |
| Input | PUT /api/orders/-1/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no known order changed. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No unintended order mutation; exact response is unresolved. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Parser/coercion must not retarget another order. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Input, oracle, and steps are clear for the negative-ID boundary case. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-008 — Non-numeric order ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-10 |
| Category | Domain |
| Preconditions | User A valid JWT; known fixtures |
| Input | PUT /api/orders/abc/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no known order changed. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No unintended order mutation; parser behavior is characterized. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Invalid path input must not select arbitrary resource. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Input, oracle, and steps are clear for a non-numeric order ID. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-009 — Decimal-like order ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-11 |
| Category | Domain |
| Preconditions | User A valid JWT; known fixtures |
| Input | PUT /api/orders/1.5/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no known order changed. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No unintended order mutation; numeric coercion behavior is characterized. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Decimal coercion must not target order 1 or another order unexpectedly. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Input, oracle, and steps are clear for a decimal-like order ID. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-010 — Very large numeric order ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-12 |
| Category | Domain |
| Preconditions | User A valid JWT; known fixtures |
| Input | PUT /api/orders/999999999999999999999/cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify no known order changed. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No unintended mutation; overflow behavior is characterized. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Large-number parsing must not resolve to arbitrary order. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Input, oracle, and steps are clear for a very large numeric ID and overflow-oriented behavior. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-011 — Missing path ID segment

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-14 |
| Category | Domain |
| Preconditions | User A valid JWT |
| Input | Route form equivalent to /api/orders//cancel if client permits |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send the malformed route separately from valid fixtures. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Must not cancel any known order; route response is characterized. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Missing target must not fall through to another resource. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The input uses 'if client permits', showing that the testcase itself does not guarantee that an empty path segment reaches the server unchanged. Many HTTP clients normalize double slashes, so a specific raw-request method such as `curl --path-as-is` is required for reproducibility. |
| Corrected Test | Use a raw-path-capable client outside the normal Postman request when necessary: `curl --path-as-is -X PUT 'http://localhost:3000/api/orders//cancel' -H 'Authorization: Bearer <User-A-token>' -H 'X-Student-Id: 23127194'`. Before and after this request, retrieve the controlled fixture orders with valid authenticated requests and verify that none changed state. Record the raw curl command/output as supporting evidence; exact HTTP status/body remain CHARACTERIZATION. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-012 — Encoded quote/path-special ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ID-13; SEC-INJ-01 |
| Category | Domain |
| Preconditions | User A valid JWT; request library can send encoded path value |
| Input | Encoded quote-like/special value in :id |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send deterministic encoded path probe; verify known orders unchanged. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Input must not broaden/retarget database selection. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Potential SEC-05 probe; no violation inferred from status alone. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers domain behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The input 'encoded quote-like/special value' does not provide a concrete literal value, so different runs or testers cannot reproduce the same probe. A fixed encoded value such as `%27` must be specified. |
| Corrected Test | Use one fixed encoded path probe: `%27` (URL-encoded single quote). Send `PUT /api/orders/%27/cancel` with a valid User A JWT and `X-Student-Id: 23127194`. Record the states of the known fixture orders before the request and verify all remain unchanged afterward. Do not infer SEC-05 compliance or violation from the status code alone. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-013 — Empty JSON object body

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-02; CT-02 |
| Category | Boundary |
| Preconditions | User A valid JWT; own pending order |
| Input | Body {} with application/json |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel with {}; fetch order afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Whatever body handling occurs, no alternative state is created; valid cancel semantics remain bounded to canceled or request is rejected without mutation. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Undocumented body cannot bypass state machine. |
| State Before | pending |
| State After | canceled OR pending if request rejected |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The `{}` input is concrete, and the oracle correctly allows the two contract-compatible outcomes: canceled if processed or pending if rejected. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-014 — Malformed JSON body

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-06 |
| Category | Boundary |
| Preconditions | User A valid JWT; own pending order |
| Input | Content-Type application/json; body {invalid |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send malformed JSON; verify order state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Parser failure must not cause unintended state mutation; exact status/body unresolved. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Malformed body must not bypass auth/state checks. |
| State Before | pending |
| State After | pending unless request is legitimately processed despite malformed body |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The malformed JSON literal `{invalid` is concrete and reproducible, and the oracle prevents unintended mutation. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-015 — JSON null body

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-07 |
| Category | Boundary |
| Preconditions | User A valid JWT; own pending order |
| Input | Body null |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify post-state. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No undocumented alternative state or ownership change; runtime handling characterized. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Unexpected type must not broaden operation semantics. |
| State Before | pending |
| State After | canceled OR pending if rejected |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The `null` body is concrete, and the oracle clearly limits the acceptable outcomes. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-016 — Array body

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-08 |
| Category | Boundary |
| Preconditions | User A valid JWT; own pending order |
| Input | Body [] |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send request; verify post-state. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No alternative state/ownership mutation; runtime handling characterized. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Unexpected body type cannot convert endpoint to another operation. |
| State Before | pending |
| State After | canceled OR pending if rejected |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The `[]` body is concrete, and the oracle clearly limits the acceptable outcomes. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-017 — Large unexpected JSON body

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-09 |
| Category | Boundary |
| Preconditions | User A valid JWT; dedicated pending order; safe generated payload |
| Input | Large JSON object with irrelevant field |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send safe deterministic large payload; verify state and service remains usable. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | No arbitrary threshold assumed; no unintended mutation outside allowed cancel semantics. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Robustness only; avoid denial-of-service scale. |
| State Before | pending |
| State After | canceled OR pending if rejected |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | 'Large JSON object with irrelevant field' does not define an exact size or field count even though the steps call it a deterministic payload. A concrete byte/character size is required for reproducibility. |
| Corrected Test | Use one deterministic safe payload: JSON body `{"padding":"<4096 literal A characters>"}` where `padding` contains exactly 4096 ASCII `A` characters, generated by the Postman pre-request script with `'A'.repeat(4096)`. Send it with `Content-Type: application/json` to a dedicated User A `pending` order. Verify that the service remains responsive and the order is either `canceled` if the undocumented body is ignored or remains `pending` if the request is rejected; no other state/ownership mutation is allowed. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-018 — Unknown benign query parameter

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | QUERY-02 |
| Category | Boundary |
| Preconditions | User A valid JWT; own pending order |
| Input | ?foo=bar |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel with benign query; verify target order afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Query must not retarget order or create alternate state; ignore/reject behavior characterized. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Undocumented query must not weaken authorization/state checks. |
| State Before | pending |
| State After | canceled OR pending if rejected |
| AI Rationale | Covers boundary behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The unknown query `?foo=bar` is concrete, and the oracle clearly limits acceptable behavior without inventing an undocumented status code. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-019 — Pending cancel then repeated cancel

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SEQ-01; ST-01/ST-05 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own pending order |
| Input | Two sequential cancel calls on same order |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify pending; cancel once; verify canceled; cancel again; verify canceled. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | First transition succeeds; second is an invalid final-state transition and must not change state. |
| Expected Schema | UNRESOLVED error schema for second call |
| Security Expectation | Repeated operation cannot reopen or corrupt terminal order. |
| State Before | pending |
| State After | canceled |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The two sequential cancel calls on the same order are explicit, with a clear oracle for both the first valid transition and the second invalid transition. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-020 — Confirmed cancel then repeated cancel

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SEQ-02; ST-02/ST-05 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own confirmed order |
| Input | Two sequential cancel calls |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify confirmed; cancel; verify canceled; repeat; verify canceled. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | First cancel succeeds; second is rejected semantically; state remains canceled. |
| Expected Schema | UNRESOLVED error schema for second call |
| Security Expectation | Terminal-state integrity preserved. |
| State Before | confirmed |
| State After | canceled |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is the same repeated-cancel sequence starting from `confirmed`; the oracle is clear and state-aware. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-021 — Shipping order cannot be user-canceled

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ST-03; PRES-01 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own shipping order |
| Input | Canonical cancel request |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify shipping; send cancel; fetch order. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Invalid transition is rejected and order remains shipping. |
| Expected Schema | UNRESOLVED error status/schema |
| Security Expectation | State authorization prevents late self-cancel. |
| State Before | shipping |
| State After | shipping |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The state-machine scenario is clear: a user cannot cancel a `shipping` order, and the post-state oracle is explicit. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-022 — Delivered final state cannot be canceled

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ST-04; PRES-02 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own delivered order |
| Input | Canonical cancel request |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify delivered; send cancel; fetch order. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Invalid transition is rejected and delivered remains final. |
| Expected Schema | UNRESOLVED error status/schema |
| Security Expectation | Final-state integrity. |
| State Before | delivered |
| State After | delivered |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The state-machine scenario is clear: `delivered` is a final state and must remain unchanged. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-023 — Canceled final state cannot be canceled again

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | ST-05; PRES-03 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own canceled order |
| Input | Canonical cancel request |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify canceled; send cancel; fetch order. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Invalid transition is rejected; state remains canceled. |
| Expected Schema | UNRESOLVED error status/schema |
| Security Expectation | Final-state integrity. |
| State Before | canceled |
| State After | canceled |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The state-machine scenario is clear: `canceled` is final and cannot be canceled again. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-024 — Unauthenticated pending order remains unchanged

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-STATE-01; PRES-04 |
| Category | State/Sequence |
| Preconditions | Own pending order exists; request sent without JWT |
| Input | PUT cancel without Authorization |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify pending using authorized read; send unauthenticated cancel; authorized read again. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Authentication failure blocks state transition; order remains pending. |
| Expected Schema | UNRESOLVED auth error schema |
| Security Expectation | SEC-02. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The scenario is valid. It partially overlaps AI-FR10-028 because both omit Authorization, but this case specifically verifies state preservation, so it provides a distinct useful oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-025 — Tampered-auth confirmed order remains unchanged

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-STATE-02 |
| Category | State/Sequence |
| Preconditions | Own confirmed order; reproducible tampered token |
| Input | Cancel with tampered JWT |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify confirmed; send request with tampered token; verify confirmed using valid token. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Invalid authentication blocks cancel; order remains confirmed. |
| Expected Schema | UNRESOLVED auth error schema |
| Security Expectation | SEC-02 signature enforcement. |
| State Before | confirmed |
| State After | confirmed |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The scenario is valid. It partially overlaps AI-FR10-032 because both use a tampered JWT, but this case specifically verifies preservation of a `confirmed` order state, so it remains useful. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-026 — Body status override cannot force delivered

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-04; SEC-STATE-01 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own pending order |
| Input | Body {"status":"delivered"} |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify pending; send cancel endpoint with override body; fetch order. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Order must never become delivered due to undocumented field; only canceled if canonical cancel is processed, otherwise pending if rejected. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | State-machine integrity. |
| State Before | pending |
| State After | canceled OR pending; never delivered |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The body `status` override scenario is concrete, and the oracle correctly prevents an undocumented direct transition to `delivered`. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-027 — Query status override cannot force delivered

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | QUERY-03; SEC-STATE-02 |
| Category | State/Sequence |
| Preconditions | User A valid JWT; own confirmed order |
| Input | ?status=delivered |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify confirmed; send cancel with query override; fetch order. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Order must never become delivered due to query; only canceled if processed, otherwise confirmed if rejected. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | State-machine integrity. |
| State Before | confirmed |
| State After | canceled OR confirmed; never delivered |
| AI Rationale | Covers state/sequence behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The query-string status override scenario is concrete, and the oracle correctly prevents an undocumented direct transition to `delivered`. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-028 — Missing Authorization header

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SEC-02; AUTH-02; SEC-AUTH-01 |
| Category | Security |
| Preconditions | User A own pending order |
| Input | No Authorization header |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify state afterward with valid token. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Request must not authenticate or mutate order. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | Direct SEC-02 coverage. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Missing Authorization is a standard SEC-02 negative-authentication scenario with a clear no-mutation oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-029 — Empty Authorization value

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-03 |
| Category | Security |
| Preconditions | User A own pending order |
| Input | Authorization: [empty] |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Empty credential must not authenticate; no mutation. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | SEC-02 negative auth. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | An empty Authorization value is a clear SEC-02 negative-authentication scenario with a clear no-mutation oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-030 — Bearer scheme without token

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-04 |
| Category | Security |
| Preconditions | User A own pending order |
| Input | Authorization: Bearer |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Missing bearer token must not authenticate; no mutation. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | SEC-02 negative auth. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Bearer authentication without a token is a clear SEC-02 negative-authentication scenario with a clear no-mutation oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-031 — Malformed JWT string

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-05; SEC-AUTH-02 |
| Category | Security |
| Preconditions | User A own pending order |
| Input | Authorization: Bearer not-a-jwt |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Malformed token must not authenticate; no mutation. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | SEC-02 negative auth. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The malformed JWT literal `not-a-jwt` is concrete and provides a clear SEC-02 negative-authentication scenario. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-032 — JWT-like token with invalid signature

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-06; SEC-AUTH-03 |
| Category | Security |
| Preconditions | Real valid token available to derive a signature-tampered copy; own pending order |
| Input | Authorization: Bearer <tampered-JWT> |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Tamper token without signing key; send cancel; verify state with valid token. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Tampered JWT must not authenticate; no mutation. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | SEC-02 signature verification. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | A JWT with a deliberately invalid signature is a clear SEC-02 scenario; the testcase also explains how to derive it from a real token without the signing key. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-033 — Wrong authentication scheme

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | AUTH-10; SEC-AUTH-05 |
| Category | Security |
| Preconditions | User A own pending order |
| Input | Authorization: Basic <value> |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Non-Bearer scheme must not be treated as valid JWT authentication. |
| Expected Schema | UNRESOLVED auth response |
| Security Expectation | SEC-02 auth scheme enforcement. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | Using the wrong authentication scheme (`Basic` instead of `Bearer`) is a clear SEC-02 scenario with an explicit no-authentication oracle. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-034 — User A cannot cancel User B pending order

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | Gate A risk-based BOLA; ID-06; CROSS-07; SEC-OWN-01 |
| Category | Security |
| Preconditions | Valid User A JWT; User B order in pending |
| Input | User A targets User B pending order ID |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify User B order pending; send cancel as User A; verify with rightful/authorized read. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | User B order remains pending; exact rejection response unresolved. |
| Expected Schema | UNRESOLVED ownership response |
| Security Expectation | Mandatory risk-based ownership/BOLA coverage, not direct FR-10 wording. |
| State Before | User B order pending |
| State After | pending |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is a clear BOLA scenario: User A must not cancel User B's `pending` order, and the state-preservation oracle is explicit. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-035 — User A cannot cancel User B confirmed order

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | Gate A risk-based BOLA; CROSS-08; SEC-OWN-02 |
| Category | Security |
| Preconditions | Valid User A JWT; User B order in confirmed |
| Input | User A targets User B confirmed order ID |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Verify confirmed; send cancel as User A; verify state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | User B order remains confirmed; exact rejection response unresolved. |
| Expected Schema | UNRESOLVED ownership response |
| Security Expectation | Isolates ownership because confirmed is otherwise cancelable. |
| State Before | User B order confirmed |
| State After | confirmed |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is a clear BOLA scenario: User A must not cancel User B's `confirmed` order, and the state-preservation oracle is explicit. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-036 — Body user_id override cannot change authorization

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | BODY-05; SEC-STATE-03 |
| Category | Security |
| Preconditions | Valid User A JWT; own pending order; User B ID known |
| Input | Body {"user_id": <User-B-id>} |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send cancel; verify ownership and state afterward. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Body must not rebind owner or authorize another resource; no ownership mutation. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Mass-assignment-style authorization risk; not SEC-06. |
| State Before | User A owns pending order |
| State After | Owner unchanged; state canceled OR pending if rejected |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The body `user_id` override is a clear mass-assignment-style authorization scenario, with explicit ownership and state oracles. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-037 — Query/path order ID conflict

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | QUERY-05; SEC-STATE-04 |
| Category | Security |
| Preconditions | Valid User A JWT; User A order and User B order both known |
| Input | Path=User-A order; query id=User-B order |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Record both states; send request; verify both. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Query id must not override path target; User B order remains unchanged. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | Parser/authorization integrity. |
| State Before | two known orders |
| State After | no unintended cross-target mutation |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | The path-ID versus query-ID conflict is concrete, and the oracle clearly requires that the query value cannot override the path target. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-038 — Boolean-style injection probe in path ID

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SEC-05; SEC-INJ-02 |
| Category | Security |
| Preconditions | Valid User A JWT; request library supports encoded payload; known fixtures |
| Input | Deterministic encoded boolean-style SQL probe in :id |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Send probe; inspect compact response and verify known orders unchanged. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Probe must not broaden target selection or cancel unrelated orders. |
| Expected Schema | UNRESOLVED / CHARACTERIZATION |
| Security Expectation | Potential SEC-05 coverage; response error alone is not a defect verdict. |
| State Before | known fixture states |
| State After | unchanged |
| AI Rationale | Covers security behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | Like AI-FR10-012, 'deterministic encoded boolean-style SQL probe' does not provide the actual payload, so the test cannot be reproduced exactly. A fixed encoded SQL-style probe must be specified. |
| Corrected Test | Use the fixed encoded SQL-style boolean probe `1%27%20OR%20%271%27%3D%271` (decoded: `1' OR '1'='1`) as the entire `:id` value. Send `PUT /api/orders/1%27%20OR%20%271%27%3D%271/cancel` with a valid User A JWT and `X-Student-Id: 23127194`. Verify that no known fixture order is canceled or otherwise changed. Treat the response as characterization; a 4xx/5xx alone does not establish SEC-05 compliance or violation. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-039 — Successful cancel response-shape characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | Schema S2; Step E |
| Category | Schema |
| Preconditions | Valid User A JWT; own pending disposable order |
| Input | Canonical cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Capture cancel response status, content type, body shape; then verify actual state. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | State must become canceled; response details are recorded as runtime characterization, not invented contract. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | No security-specific claim beyond authenticated allowed transition. |
| State Before | pending |
| State After | canceled |
| AI Rationale | Covers schema behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is a valid response-characterization testcase for successful cancellation: the state oracle is authoritative while response shape is recorded without being promoted to contract. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-040 — Invalid shipping transition response characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | FR-10 appropriate-message rule; Schema S2 |
| Category | Schema |
| Preconditions | Valid User A JWT; own shipping order |
| Input | Canonical cancel |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Capture rejection status/content type/body; verify shipping unchanged. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Response must not falsely claim successful cancellation; an error response/message exists semantically; exact text/status unresolved. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | State rejection remains authoritative oracle. |
| State Before | shipping |
| State After | shipping |
| AI Rationale | Covers schema behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is a valid response-characterization testcase for an invalid `shipping` transition, with the state oracle remaining authoritative. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-041 — Authentication failure response characterization

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SEC-02; Schema S2 |
| Category | Schema |
| Preconditions | Own pending order exists |
| Input | Cancel without Authorization |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Capture response shape; verify order remains pending using authorized read. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Authentication failure must not mutate; response schema/content type characterized only. |
| Expected Schema | CHARACTERIZATION ONLY |
| Security Expectation | SEC-02. |
| State Before | pending |
| State After | pending |
| AI Rationale | Covers schema behavior traced to approved FR-10 analysis. |
| Human Audit Status | VALID |
| Human Audit Reason | This is a valid authentication-failure response-characterization testcase. It partially overlaps AI-FR10-024/028 but has a distinct purpose: characterize response shape rather than only state/auth behavior. |
| Corrected Test | |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

## AI-FR10-042 — Official X-Student-Id evidence assertion

| Field | Value |
| --- | --- |
| Source | AI |
| API | PUT /api/orders/:id/cancel |
| Requirement Basis | SID-01; HW06 project constraint |
| Category | Schema |
| Preconditions | Any runtime-ready testcase execution |
| Input | X-Student-Id: 23127194 |
| Headers | `X-Student-Id: 23127194`; Authorization as specified by the testcase |
| Steps | Inspect outgoing Newman/Postman request evidence and compact execution summary header count. |
| Expected Status | UNRESOLVED unless the testcase only requires semantic rejection/acceptance |
| Expected Response | Every official execution request carries exact student header; no SUT negative behavior inferred. |
| Expected Schema | REQUEST-EVIDENCE ASSERTION |
| Security Expectation | Evidence-integrity requirement rather than business auth. |
| State Before | N/A |
| State After | N/A |
| AI Rationale | Covers schema behavior traced to approved FR-10 analysis. |
| Human Audit Status | INCOMPLETE |
| Human Audit Reason | The precondition 'Any runtime-ready testcase execution' is too vague because it does not identify a concrete request as the evidence source. It also overlaps with AI-FR10-004, so one specific official request should be bound to this evidence assertion. |
| Corrected Test | Bind this evidence assertion to the official FR10 Newman run. After the run, parse `postman/newman/FR10-official-report.json` and verify two things: (1) every execution contains `X-Student-Id`, and (2) every such header value is exactly `23127194`. Also use AI-FR10-001 as the representative request when producing human-readable header evidence. This case is suite-wide evidence verification and does not duplicate AI-FR10-004's canonical-request/state objective. |
| Correction Status | VALID — HUMAN RE-REVIEW APPROVED |
| Execution Status | |
| Actual Result | |
| Evidence | |
| Defect ID | |

