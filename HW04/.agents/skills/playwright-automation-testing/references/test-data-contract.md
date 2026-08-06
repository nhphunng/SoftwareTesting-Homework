# External Test Data Contract

Use one file per feature under `HW04/data/`.

```json
{
  "feature": "FR-05",
  "cases": [
    {
      "id": "FR05-DT-007",
      "description": "Exact-name search",
      "enabled": true,
      "preconditions": ["Product list is loaded"],
      "input": {
        "keyword": "MacBook Pro M3"
      },
      "expected": {
        "productName": "MacBook Pro M3",
        "resultCount": 1
      }
    }
  ]
}
```

## Rules

- Require a unique source test case `id` and a concise `description`.
- Keep actions and selectors in Page Objects/specs, not in data.
- Keep input values and expected business outcomes in data.
- Add fields only when the feature needs them; do not force irrelevant null fields.
- Do not put passwords or tokens in JSON. Read credentials from environment variables.
- Validate the parsed structure before generating tests.
- Reject duplicate IDs and malformed cases early.
- Preserve boundary values exactly; do not normalize them in the data loader.

