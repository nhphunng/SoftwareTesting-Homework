# FR05-BUG-03 — Product creation accepts missing required fields and persists an all-null product

GitHub Issue: https://github.com/nhphunng/SoftwareTesting-Homework/issues/26

## Summary

`POST /api/products` accepts a request body that contains none of the required product fields and persists a product record whose product fields are all `null`. This violates README requirement **FR-15** input constraints.

## Severity

**High**

Reason: invalid product data can be persisted despite explicit required-field and value constraints, corrupting product data integrity.

## Found by

- **Human-added test:** `HUMAN-FR05-048`
- AI missed: **Yes**
- Root coverage gap: malformed product mutation / missing validation

## API

`POST /api/products`

## Requirement basis

**README — FR-15 Product CRUD**

Product input constraints require:

- name: required, maximum 255 characters;
- price: required and positive (`> 0`);
- category: required and must be selected from the existing category list.

Supporting API contract:

`api_specification.md` documents the product create/update body with:

- `name`
- `price`
- `description`
- `imageUrl`
- `category_id`

## Preconditions

- SUT running at `http://localhost:3000`.
- Request includes `X-Student-Id: 23127194`.
- No cleanup is performed before evidence review so the persisted record remains inspectable.

## Reproduction

Send:

```http
POST /api/products?search=phone
Content-Type: application/json
X-Student-Id: 23127194

{"unexpectedSearchField":"phone"}
```

Then fetch the product list.

## Expected

The product create request must not persist a product unless required product constraints are satisfied, including:

- non-empty product name;
- positive price;
- valid category.

The exact validation error schema/status code is not specified, so the confirmed defect is acceptance/persistence of invalid data, not a specific error code.

## Actual

The official Newman execution returned:

```text
HTTP 200
{"message":"Product created","id":8}
```

The subsequent product listing contained:

```json
{
  "id": 8,
  "name": null,
  "price": null,
  "description": null,
  "imageUrl": null,
  "category_id": null
}
```

The before/after product ID comparison also confirmed that a new persistent record was created.

## Reproducibility

**2/2 observed runs**

- Smoke run: reproduced.
- Official Newman run: reproduced.

## Evidence

- Screenshot: `PoolA-FR-05-ProductSearch/evidence/screenshots/FR05-BUG-03.png`
- `PoolA-FR-05-ProductSearch/evidence/FR05-official-failure-evidence.json`
- `PoolA-FR-05-ProductSearch/evidence/FR05-execution-summary.md`
- `PoolA-FR-05-ProductSearch/evidence/FR05-human-gate-g-review.md`
- `postman/newman/FR05-official-report.html`
- `postman/newman/FR05-official-report.json`

## Evidence state

Product ID `8` is intentionally preserved after Human Gate G so the malformed persisted state can be inspected during Step L documentation.

## Confirmation

**CONFIRMED DEFECT — Human Gate G approved**

Contract violated: **FR-15**.
