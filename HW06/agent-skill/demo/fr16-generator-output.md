# Generated API Test Candidates

- Endpoint: `POST /api/admin/import-products`
- FR: `FR16`
- Gate: **HUMAN_REVIEW_REQUIRED**
- Candidate count: **8**

## Requirement Model

```json
{
  "selectedFR": "FR16",
  "selectedEndpoint": "POST /api/admin/import-products",
  "source": "source/api_specification.md",
  "sourceLines": {
    "start": 173,
    "end": 200,
    "endpoint": 185
  },
  "heading": "6.3 Import Sản phẩm từ CSV (JSON Array)",
  "sourceEvidence": [
    {
      "line": 173,
      "text": "*Tất cả API dưới đây yêu cầu `Authorization: Bearer <token>` và tài khoản phải có quyền Admin.*"
    },
    {
      "line": 175,
      "text": "### 6.1 Quản lý Người dùng"
    },
    {
      "line": 176,
      "text": "- **Lấy danh sách người dùng:** `GET /api/admin/users`"
    },
    {
      "line": 177,
      "text": "- **Xóa người dùng:** `DELETE /api/admin/users/:id`"
    },
    {
      "line": 179,
      "text": "### 6.2 Quản lý Đơn hàng (Toàn hệ thống)"
    },
    {
      "line": 180,
      "text": "- **Lấy danh sách đơn hàng:** `GET /api/admin/orders`"
    },
    {
      "line": 181,
      "text": "- **Cập nhật trạng thái đơn hàng:** `PUT /api/admin/orders/:id/status`"
    },
    {
      "line": 182,
      "text": "- **Body (JSON):** `{\"status\": \"confirmed\"}` (Các trạng thái: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`)."
    },
    {
      "line": 184,
      "text": "### 6.3 Import Sản phẩm từ CSV (JSON Array)"
    },
    {
      "line": 185,
      "text": "- **Endpoint:** `POST /api/admin/import-products`"
    },
    {
      "line": 186,
      "text": "- **Body (JSON):**"
    },
    {
      "line": 187,
      "text": "```json"
    },
    {
      "line": 188,
      "text": "{"
    },
    {
      "line": 189,
      "text": "\"products\": ["
    },
    {
      "line": 190,
      "text": "{"
    },
    {
      "line": 191,
      "text": "\"name\": \"SP 1\","
    },
    {
      "line": 192,
      "text": "\"price\": 10000,"
    },
    {
      "line": 193,
      "text": "\"description\": \"Mô tả 1\","
    },
    {
      "line": 194,
      "text": "\"imageUrl\": \"\","
    },
    {
      "line": 195,
      "text": "\"category_id\": 1"
    },
    {
      "line": 196,
      "text": "}"
    },
    {
      "line": 197,
      "text": "]"
    },
    {
      "line": 198,
      "text": "}"
    },
    {
      "line": 199,
      "text": "```"
    }
  ],
  "securityRequirementsInput": "SEC-02 valid JWT required; SEC-03 admin role required",
  "policy": "Only source-supported facts may become contract assertions; unsupported semantics remain unresolved/characterization."
}
```

## Coverage Model

```json
{
  "domain": {
    "status": "GENERATED",
    "candidates": 3
  },
  "stateTransition": {
    "status": "REVIEW_REQUIRED",
    "candidates": 0
  },
  "security": {
    "status": "GENERATED",
    "candidates": 3
  },
  "schema": {
    "status": "CHARACTERIZATION_ONLY",
    "candidates": 1
  },
  "deduplicatedCandidateCount": 8
}
```

## Candidate Tests

### GEN-001 — Canonical documented request

- Category: Functional
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Send the documented example/request shape.
- Oracle: Characterize the response; assert only explicitly documented contract facts.

### GEN-002 — Body field products: omitted

- Category: Domain
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Omit top-level field products.
- Oracle: Characterize validation; exact rejection status is asserted only if documented.
- Unresolved: requiredness may be unresolved; exact failure schema may be unresolved

### GEN-003 — Body field products: null

- Category: Boundary
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Set top-level field products to null.
- Oracle: Characterize type/null handling; no invented constraint.
- Unresolved: nullability unresolved

### GEN-004 — Body field products: wrong type

- Category: Boundary
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Replace products with an incompatible JSON type.
- Oracle: Request must not produce unintended mutation; characterize response.
- Unresolved: exact type validation contract unresolved

### GEN-005 — Missing bearer token

- Category: Security
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Send the request without Authorization.
- Oracle: Request must not gain authenticated access; exact status only if documented.
- Unresolved: exact auth failure status/schema unresolved

### GEN-006 — Malformed bearer token

- Category: Security
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Send a malformed Bearer token.
- Oracle: Malformed credential must not authenticate.
- Unresolved: exact auth failure status/schema unresolved

### GEN-007 — Valid non-admin actor

- Category: Security
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Use a valid JWT for a known non-admin account.
- Oracle: Actor must not gain admin-only capability.
- Unresolved: exact authorization rejection status/schema unresolved

### GEN-008 — Response shape characterization

- Category: Schema
- Source: AI_CANDIDATE
- Review: PENDING_HUMAN_REVIEW
- Stimulus: Send a canonical request and record status/content type/body shape.
- Oracle: Record runtime shape without promoting it to contract.
- Unresolved: exact response schema unresolved
