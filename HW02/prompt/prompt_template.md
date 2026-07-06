Use the domain-boundary-testing skill for FR-17 Coupon Management CRUD.

  Goal:
  Create the first draft of testing artifacts for this feature.

  Requirements:
  1. Identify inputs and outputs.
  2. Identify validation rules and assumptions.
  3. Create equivalence classes.
  4. Create Domain Testing test cases.
  5. Create Boundary Value Analysis test cases.
  6. Add AI Gap Analysis.
  7. Add Human Review notes.
  8. Suggest a Git commit message.

  Do not invent actual execution results. Use Actual Result = TBD and Status = Not Executed.
  Save the output to test-cases/FR17-coupon-management-crud.md.

  FEATURE INFORMATION
  Feature ID: FR-17
  Required fields:
    - code: required and unique
    - type: required; allowed values are percent and fixed
    - discount_value: required and must be positive
  [Image #1]