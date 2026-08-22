# API 1 — FR-05 Product Search — State/Sequence Analysis

## 1. Scope and basis

```text
Endpoint: GET /api/products
Query: ?search=keyword (optional)
FR: FR-05 — Product listing and search
Authentication: Public
Operation type: Read-only
```

This Step C analysis follows `$api-testing-human-loop` Gate C and the approved Option B source model:

1. `README.md` = business truth / expected business behavior.
2. `api_specification.md` = API interface contract.
3. `backend/server.js` = implementation observation only.

Step A already established:

```text
State machine: N/A
State change: none expected
```

Step B also established dataset conditions D1–D5 as **test-data preconditions**, not API state transitions.

---

## 2. Explicit business state machine

### Finding

```text
No explicit state machine applies to this API.
```

Neither FR-05 nor `api_specification.md` defines:

- lifecycle states for a search operation;
- state-transition actions;
- terminal search states;
- permission-dependent transitions;
- cancel transitions;
- mutable server-side search session state.

`GET /api/products` is a read-only retrieval/search operation.

Therefore the generic transition dimensions below are **not applicable as true state transitions**:

| Generic State Dimension | FR-05 Applicability | Reason |
| --- | --- | --- |
| Initial state | N/A | No search resource/session lifecycle is defined |
| Valid transition | N/A | GET search does not transition a business entity |
| Invalid transition | N/A | No transition rules exist |
| Terminal state | N/A | No business state machine exists |
| Cancellation | N/A | Search operation has no cancel state/action contract |
| Transition without permission | N/A | Endpoint is public and has no transition action |
| Concurrent transition | N/A | Read operation does not mutate state |

This avoids fabricating a state machine merely to satisfy a generic checklist.

---

## 3. Contextual data states

Although there is no state machine, test outcomes depend on known product-dataset conditions. These are **preconditions**, not transitions.

| ID | Contextual data state | Meaning | Related partitions |
| --- | --- | --- | --- |
| DS-FR05-01 | Matching product exists | At least one product name matches the chosen keyword | P-FR05-02, P-FR05-07, P-FR05-08 |
| DS-FR05-02 | No matching product exists | No product name matches the chosen keyword | P-FR05-03 |
| DS-FR05-03 | Keyword only exists outside product name | Description/category may contain keyword, but product name does not | P-FR05-09 |
| DS-FR05-04 | Unicode/Vietnamese name data exists | Product names support a chosen Unicode/Vietnamese search representative | P-FR05-10 |
| DS-FR05-05 | Known exact product name exists | Dataset supports an exact-name representative | P-FR05-07 |

These conditions should be established before execution. A test must not infer expected search results from an unknown dataset.

---

## 4. Authentication/permission state

The API contract documents `GET /api/products` as public.

Therefore:

```text
Authenticated vs unauthenticated is not a business state transition for FR-05.
```

Potential request contexts:

| Context | Expected contract treatment |
| --- | --- |
| No Authorization header | Valid public access context |
| Valid Authorization header supplied unnecessarily | No FR-05-specific behavior is defined |
| Invalid/expired Authorization header supplied unnecessarily | `UNRESOLVED`; endpoint is not documented as requiring auth, so do not invent a rejection requirement |

Detailed token/security behavior is deferred to Step D and should not be converted into a state transition model.

---

## 5. Resource existence/deletion context

FR-05 searches the **current product dataset**. The search request itself does not create, modify, or delete products.

Potential pre-execution contexts include:

```text
product exists before search
product does not exist before search
product dataset changes between separate search requests
```

The first two are test-data conditions.

The third may affect repeatability if another actor modifies the dataset, but it is not a transition caused by `GET /api/products`.

Therefore any sequence test that compares multiple GET responses must control or account for dataset stability.

---

## 6. Sequence analysis

Even without a state machine, request sequences can be useful for detecting unintended server-side coupling or inconsistent read behavior.

### SQ-FR05-01 — Repeat same listing request

```text
GET /api/products
GET /api/products
```

Precondition:

```text
Product dataset remains unchanged between requests.
```

Purpose:

- characterize repeatability of a read-only request;
- detect unintended mutation caused by GET;
- support later comparison if deterministic ordering is human-approved or otherwise controlled.

Important limitation:

Exact ordering is currently `UNRESOLVED`, so equality must not be asserted in a way that invents ordering guarantees.

---

### SQ-FR05-02 — Repeat same search request

```text
GET /api/products?search=<keyword>
GET /api/products?search=<keyword>
```

Precondition:

```text
Dataset remains unchanged.
```

Expected business invariant:

```text
The first search must not mutate product data or create a new server-side search state that changes FR-05 semantics for the second request.
```

This is a read-only/idempotency-style sequence, not a business state transition.

---

### SQ-FR05-03 — Search A followed by Search B

```text
GET /api/products?search=<keyword-A>
GET /api/products?search=<keyword-B>
```

Purpose:

- detect unintended carry-over of keyword A into keyword B;
- verify each request is evaluated using its own query input;
- characterize request independence.

Expected invariant:

```text
Search B must be evaluated from its own request input, not stale state from Search A.
```

This expectation follows ordinary request isolation and FR-05 search-by-input semantics; it does not imply a persistent search session.

---

### SQ-FR05-04 — Search followed by unfiltered listing

```text
GET /api/products?search=<keyword>
GET /api/products
```

Purpose:

- ensure the prior search does not permanently filter subsequent listing behavior;
- verify the optional `search` parameter is request-scoped.

Expected business invariant:

```text
Omitting `search` on the second request must represent product-listing behavior, independent of the prior search request.
```

This is source-supported by the optional-query contract plus FR-05 listing behavior.

---

### SQ-FR05-05 — Characterization input followed by normal search

Example:

```text
GET /api/products?search=<empty/whitespace/duplicate/security-oriented value>
GET /api/products?search=<known normal keyword>
```

Purpose:

- detect unintended persistent side effects from unusual input;
- confirm later normal requests remain independent.

Expected requirement level:

```text
No persistent mutation of product-search behavior should be introduced by a prior GET request.
```

Exact behavior of the unusual first input remains governed by Step A/B decisions and may be `UNRESOLVED`/characterization.

---

## 7. Repeated/idempotent operation analysis

HTTP GET is used by the documented API and the business behavior is read-only.

For this testing model, the relevant invariant is:

```text
Repeated product-search requests must not mutate product data as a consequence of the search operation itself.
```

Do not overstate this as a guarantee of byte-identical responses because:

- ordering is unspecified;
- dataset may change externally;
- timestamps/metadata, if any, are not formally specified.

Thus Step C uses **read-only non-mutation** rather than strict response identity as the sequence invariant.

---

## 8. Concurrency analysis

### True concurrent state transition

```text
N/A
```

Two concurrent GET searches do not compete to update a shared business state according to the contract.

### Relevant concurrency context

Concurrent product mutations by another actor could change the dataset while searches are running. That is an environment/data-consistency concern, not a FR-05 state-transition rule.

For deterministic homework execution:

```text
Keep the product dataset stable while validating search semantics unless a dedicated concurrency test is intentionally designed.
```

No concurrency-specific expected isolation level is defined by FR-05 or the API specification.

---

## 9. State/sequence coverage matrix

| ID | Type | Basis | Expected confidence |
| --- | --- | --- | --- |
| DS-FR05-01 | Data precondition | FR-05 search by name | Resolved |
| DS-FR05-02 | Data precondition | FR-05 no-match context | Resolved semantics |
| DS-FR05-03 | Data precondition | Search must be by product name | Strong resolved negative context |
| DS-FR05-04 | Data precondition | Step B Unicode representative | Characterization support |
| DS-FR05-05 | Data precondition | Step B exact-name representative | Resolved support |
| SQ-FR05-01 | Repeated read | Read-only behavior | Non-mutation invariant; strict response identity not assumed |
| SQ-FR05-02 | Repeated same search | Read-only/search-by-input behavior | Non-mutation/request independence |
| SQ-FR05-03 | Search A → Search B | Request-scoped query semantics | Strong request-isolation sequence |
| SQ-FR05-04 | Search → listing | Optional query + listing behavior | Strong request-isolation sequence |
| SQ-FR05-05 | Unusual input → normal search | Read-only behavior | Robustness/sequence characterization |

---

## 10. Human Gate C — review options

### Review Item 1 — Whether FR-05 should have a formal state machine artifact

- **Option A:** Create artificial states such as `UNSEARCHED → SEARCHED → RESULT/EMPTY` and test transitions.
- **Option B:** Explicitly declare **no business state machine**, and model only contextual data states plus request sequences.
- **Option C:** Skip Step C entirely and create no state/sequence artifact.

**Recommended: B** — satisfies the plan and `$api-testing-human-loop` without inventing lifecycle states.

### Review Item 2 — Repeatability expectation

- **Option A:** Require two identical GET requests to produce byte-identical/full-order-identical responses.
- **Option B:** Require only **read-only non-mutation and equivalent search semantics** under a stable dataset; do not invent ordering guarantees.
- **Option C:** Do not test repeated requests at all.

**Recommended: B** — preserves a meaningful sequence invariant while respecting unresolved response ordering/schema.

### Review Item 3 — Search A → Search B / Search → listing sequences

- **Option A:** Keep both sequence classes to verify request independence and no stale search state.
- **Option B:** Keep only repeated-same-search and remove cross-query sequences as redundant.
- **Option C:** Remove all request sequence testing because no state machine exists.

**Recommended: A** — these are low-cost, meaningful sequence checks and do not fabricate a state machine.

### Review Item 4 — Authentication context in Step C

- **Option A:** Model authenticated/unauthenticated/invalid-token as formal states.
- **Option B:** Record authentication as contextual only; endpoint is public, and detailed auth/security analysis stays in Step D.
- **Option C:** Remove all mention of authentication from Step C.

**Recommended: B** — retains useful context without misclassifying auth as FR-05 state.

### Review Item 5 — Concurrent dataset changes

- **Option A:** Add concurrent product mutation/search as a required Step C test dimension.
- **Option B:** Record it as an environment/data-stability concern only; no isolation expectation exists in the source.
- **Option C:** Infer transactional/isolation expectations from SQLite/implementation behavior.

**Recommended: B** — avoids introducing unsupported concurrency requirements.

### Human Gate C decisions

The tester selected:

```text
1B — No formal business state machine; keep contextual data states and request sequences
2B — Repeatability requires read-only non-mutation and equivalent search semantics under a stable dataset, not byte-identical/full-order-identical responses
3A — Keep both Search A → Search B and Search → unfiltered listing sequences to verify request independence and no stale search state
4B — Keep authentication as contextual only; detailed auth/security analysis remains in Step D
5B — Treat concurrent dataset changes as an environment/data-stability concern only; do not invent isolation requirements
```

These decisions approve the Step C model without creating artificial lifecycle states or unsupported concurrency/authentication expectations.

---

## 11. Step C status

```text
Explicit business state machine: NOT APPLICABLE
Contextual data states: APPROVED
Request sequences: APPROVED
Gate C: COMPLETE
Next step: Step D — Security Analysis
```
