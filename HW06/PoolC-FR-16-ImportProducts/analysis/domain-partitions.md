# FR-16 Import Products — Domain Partition Design

Date: 2026-08-21  
API: `POST /api/admin/import-products`  
Primary requirement: FR-16 — Import Products from CSV  
Gate A: **APPROVED**  
Human Gate B status: **APPROVED**

Gate B decision: the reviewer approved the dual-surface CSV + JSON partition model, including direct rollback coverage for invalid first/middle/last rows and direct SEC-03 role-boundary coverage for valid non-admin JWTs.

## Gate A decision carried forward

The reviewer approved a dual-surface testing model:

1. **CSV business contract surface** from FR-16.
2. **JSON `products[]` API contract surface** from `api_specification.md`.

The mismatch between those two surfaces remains explicit. Domain partitions must not silently convert one contract into the other.

## Partitioning principles

- Use only contract-defined boundaries as mandatory expectations.
- Keep unspecified size/count/length limits as `UNRESOLVED` or robustness characterization.
- Do not invent exact HTTP status codes where the contract is silent.
- Treat authentication and admin authorization as direct contract-backed dimensions because FR-12, SEC-02, and SEC-03 apply.
- Preserve atomic rollback as a primary persistence oracle for invalid batches.
- Separate CSV parsing/business-compliance partitions from JSON request-shape partitions.
- Treat FR-15-only constraints such as `name <= 255` and valid existing category as unresolved cross-requirement candidates, not direct FR-16 rules.
- `X-Student-Id: 23127194` is an assignment/evidence requirement, not a SUT business input.

---

# 1. CSV business-contract surface

## 1.1 File presence and file type

| Partition ID | Input dimension | Partition | Example | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- | --- |
| CSV-FILE-01 | File presence | Valid CSV file supplied | `products.csv` | Import workflow may proceed to parsing/validation | CONTRACT-BACKED VALID |
| CSV-FILE-02 | File presence | Missing file | no file | Import must not succeed; exact API/UI error semantics UNRESOLVED | CONTRACT-BACKED INVALID / MISSING |
| CSV-FILE-03 | Extension | `.csv` | `products.csv` | Valid file extension | CONTRACT-BACKED VALID |
| CSV-FILE-04 | Extension | Non-CSV extension | `products.txt` | Must not be accepted as compliant FR-16 CSV upload | CONTRACT-BACKED INVALID |
| CSV-FILE-05 | Extension | No extension | `products` | Not compliant with explicit `.csv` requirement | CONTRACT-BACKED INVALID |
| CSV-FILE-06 | Extension | Case variant | `products.CSV` | Case-sensitivity is not defined; characterize behavior | UNRESOLVED / CHARACTERIZATION |
| CSV-FILE-07 | Multiple-dot filename | final extension `.csv` | `products.backup.csv` | FR-16 only specifies `.csv` extension; likely compliant by final suffix, exact filename parser behavior characterized | CONTRACT-INTERPRETATION / CHARACTERIZATION |
| CSV-FILE-08 | Misleading extension | filename `.csv` but non-CSV content | `products.csv` containing arbitrary text/binary | Must not produce a successful valid import if content cannot satisfy CSV/header/row contract | CONTENT INVALID |

### Notes

FR-16 defines the extension but does not define MIME type, filename length, or case sensitivity. No arbitrary file-size boundary is introduced here.

---

## 1.2 CSV header partitions

Required exact header:

```text
name,price,description,imageUrl,category_id
```

| Partition ID | Partition | Example first row | Expected | Type |
| --- | --- | --- | --- | --- |
| CSV-HDR-01 | Exact required header | `name,price,description,imageUrl,category_id` | Valid header | CONTRACT-BACKED VALID |
| CSV-HDR-02 | Missing header row | first row is product data | Must not be treated as a compliant FR-16 import | CONTRACT-BACKED INVALID |
| CSV-HDR-03 | Missing required column | `name,price,description,imageUrl` | Invalid header | CONTRACT-BACKED INVALID |
| CSV-HDR-04 | Extra column | `name,price,description,imageUrl,category_id,stock` | Exact-header requirement is violated | CONTRACT-BACKED INVALID |
| CSV-HDR-05 | Reordered columns | `price,name,description,imageUrl,category_id` | Exact header/order requirement is violated | CONTRACT-BACKED INVALID |
| CSV-HDR-06 | Duplicate header | `name,price,name,imageUrl,category_id` | Invalid relative to exact header requirement | CONTRACT-BACKED INVALID |
| CSV-HDR-07 | Header case changed | `Name,price,description,imageUrl,category_id` | Exact-header wording suggests invalid; preserve as direct exact-match test | CONTRACT-BACKED INVALID |
| CSV-HDR-08 | Header with leading/trailing spaces | ` name,price,description,imageUrl,category_id ` | Exact-header requirement violated unless parser normalizes; characterize but do not silently accept | CONTRACT-BACKED INVALID / PARSER |
| CSV-HDR-09 | UTF-8 BOM before first header token | `\uFEFFname,price,...` | BOM handling not specified; characterization only | PARSER CHARACTERIZATION |
| CSV-HDR-10 | Empty first line before correct header | blank line then correct header | Whether blank lines are tolerated before header is UNRESOLVED | PARSER CHARACTERIZATION |

---

## 1.3 RFC 4180 / CSV parsing partitions

FR-16 explicitly requires support for comma-containing fields when enclosed in double quotes.

| Partition ID | Partition | Example row fragment | Expected | Type |
| --- | --- | --- | --- | --- |
| CSV-PARSE-01 | Simple unquoted fields | `SP1,10000,Mo ta,,1` | Parse as five fields | CONTRACT-BACKED VALID |
| CSV-PARSE-02 | Quoted field containing comma | `SP1,10000,"Mo ta, ban dac biet",,1` | Comma inside quoted field remains data, not delimiter | CONTRACT-BACKED VALID |
| CSV-PARSE-03 | Quoted product name containing comma | `"SP, 1",10000,Mo ta,,1` | Parse quoted comma correctly | CONTRACT-BACKED VALID |
| CSV-PARSE-04 | Unquoted comma creates extra field | `SP1,10000,Mo ta, co dau phay,,1` | Not compliant with required five-column row shape | CONTRACT-BACKED INVALID / MALFORMED |
| CSV-PARSE-05 | Unterminated quote | `SP1,10000,"Mo ta,,1` | Malformed CSV; must not result in valid compliant import | MALFORMED CSV |
| CSV-PARSE-06 | Escaped double quote inside quoted field | `SP1,10000,"Size ""XL""",,1` | RFC 4180-style doubled quote should be parsed as literal quote | CONTRACT-BACKED VALID / RFC4180 |
| CSV-PARSE-07 | Embedded newline inside quoted field | quoted multiline description | RFC 4180 permits quoted line breaks; FR-16 references RFC 4180 behavior but only explicitly mentions commas. Treat as characterization unless reviewer promotes broader RFC4180 coverage | RFC4180 CHARACTERIZATION |
| CSV-PARSE-08 | CRLF line endings | standard RFC4180 CRLF file | Should be supported under RFC4180-oriented expectation; no exact parser response invented | RFC4180 CHARACTERIZATION |
| CSV-PARSE-09 | LF-only line endings | Unix-style CSV | Line-ending strictness not specified | CHARACTERIZATION |
| CSV-PARSE-10 | Empty file | zero bytes | Cannot contain required header/data; must not yield valid import | CONTRACT-BACKED INVALID |
| CSV-PARSE-11 | Header-only file, zero data rows | correct header only | Whether empty batch is allowed is not stated; characterize | UNRESOLVED / EMPTY BATCH |

---

## 1.4 CSV row `name` partitions

Direct FR-16 rule: `name` must not be empty.

| Partition ID | Partition | Example | Expected | Type |
| --- | --- | --- | --- | --- |
| CSV-NAME-01 | Non-empty ordinary value | `SP 1` | Valid with respect to FR-16 name rule | CONTRACT-BACKED VALID |
| CSV-NAME-02 | Empty field | `,10000,...` | Invalid row; entire batch must rollback | CONTRACT-BACKED INVALID |
| CSV-NAME-03 | Quoted empty string | `"",10000,...` | Semantically empty; invalid row; rollback | CONTRACT-BACKED INVALID |
| CSV-NAME-04 | Whitespace-only name | `   ` | FR-16 says non-empty but does not define trimming; expected validity is UNRESOLVED | UNRESOLVED / WHITESPACE |
| CSV-NAME-05 | Leading/trailing spaces around non-empty name | `  SP 1  ` | Trimming/normalization semantics not defined | CHARACTERIZATION |
| CSV-NAME-06 | Unicode/Vietnamese name | `Cà phê sữa` | Non-empty; should be valid absent another constraint | CONTRACT-BACKED VALID |
| CSV-NAME-07 | Name containing comma in quotes | `"SP, loại A"` | Valid if parser honors quoted comma | CONTRACT-BACKED VALID / RFC4180 |
| CSV-NAME-08 | Name containing quotes escaped per RFC4180 | `"SP ""Premium"""` | Valid parser case if supported | RFC4180 VALID |
| CSV-NAME-09 | Very long non-empty name | generated >255 chars | FR-15 defines 255 max, but FR-16 inheritance is unresolved; characterize, do not assert mandatory rejection under FR-16 | CROSS-REQ / UNRESOLVED |
| CSV-NAME-10 | Formula-like leading character | `=2+2` | FR-16 does not define formula-injection handling; security characterization only | SECURITY CHARACTERIZATION |

---

## 1.5 CSV row `price` partitions

Direct FR-16 rule: price must be a positive number (`> 0`).

| Partition ID | Partition | Example | Expected | Type |
| --- | --- | --- | --- | --- |
| CSV-PRICE-01 | Positive integer | `10000` | Valid | CONTRACT-BACKED VALID |
| CSV-PRICE-02 | Smallest semantic positive integer representative | `1` | Valid; contract boundary is `> 0` | CONTRACT-BACKED BOUNDARY VALID |
| CSV-PRICE-03 | Zero | `0` | Invalid; entire batch rollback | CONTRACT-BACKED BOUNDARY INVALID |
| CSV-PRICE-04 | Negative number | `-1` | Invalid; entire batch rollback | CONTRACT-BACKED INVALID |
| CSV-PRICE-05 | Positive decimal | `1.5` | FR-16 says positive number, not integer; valid with respect to sign unless storage/domain says otherwise | CONTRACT-BACKED VALID |
| CSV-PRICE-06 | Non-numeric text | `abc` | Not a positive number; invalid; rollback | CONTRACT-BACKED INVALID |
| CSV-PRICE-07 | Empty price | empty field | Not a positive number; invalid; rollback | CONTRACT-BACKED INVALID / MISSING |
| CSV-PRICE-08 | Whitespace-only | spaces | Numeric trimming semantics not specified; must not be silently treated as a known valid positive value | PARSER / CHARACTERIZATION |
| CSV-PRICE-09 | Numeric string with leading plus | `+10` | Numeric parser acceptance not specified | CHARACTERIZATION |
| CSV-PRICE-10 | Scientific notation | `1e3` | Numeric grammar not defined; characterize | CHARACTERIZATION |
| CSV-PRICE-11 | Very large positive number | `999999999999999999999` | No maximum defined; overflow/storage characterization, not invented boundary | ROBUSTNESS |
| CSV-PRICE-12 | `NaN` / `Infinity` text | `NaN`, `Infinity` | Not ordinary positive numeric CSV value; parser/validation characterization | INVALID / ROBUSTNESS |

The only direct numeric boundary is around zero: valid domain is `price > 0`; zero and negatives are invalid.

---

## 1.6 CSV `description`, `imageUrl`, `category_id`

FR-16 does not state explicit validation rules for these three fields beyond requiring them in the exact header.

### `description`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| CSV-DESC-01 | Non-empty ordinary text | `Mô tả` | Characterize as normal input |
| CSV-DESC-02 | Empty field | empty | FR-16 does not prohibit empty description |
| CSV-DESC-03 | Quoted comma text | `"Mô tả, chi tiết"` | Must parse comma correctly under FR-16 quoted-comma rule |
| CSV-DESC-04 | Unicode | Vietnamese/emoji | No restriction specified; characterize |
| CSV-DESC-05 | HTML/script-like content | `<script>...</script>` | API/import acceptance is characterization; UI rendering safety belongs later to SEC-04/UI evidence |
| CSV-DESC-06 | Formula-like prefix | `=HYPERLINK(...)` | CSV formula-injection risk characterization; no direct FR-16 rejection rule |

### `imageUrl`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| CSV-IMG-01 | Empty value | empty | FR-16 does not forbid it |
| CSV-IMG-02 | URL-looking value | `https://example.test/a.png` | Characterization |
| CSV-IMG-03 | Non-URL text | `not-a-url` | Exact validity unresolved; no URL-format requirement in FR-16 |
| CSV-IMG-04 | Comma-containing quoted text | quoted value | Parser behavior only |

### `category_id`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| CSV-CAT-01 | Existing category ID | controlled existing ID | Normal valid representative if runtime fixture exists |
| CSV-CAT-02 | Missing/empty category ID | empty | FR-16 does not explicitly define invalidity; unresolved because header includes the field but validation rule is not stated |
| CSV-CAT-03 | Non-existing category ID | controlled missing ID | FR-15 says valid existing category for Product CRUD; FR-16 inheritance unresolved |
| CSV-CAT-04 | Non-numeric text | `abc` | Type/DB robustness characterization; FR-16 does not define category grammar |
| CSV-CAT-05 | Zero/negative | `0`, `-1` | No FR-16 numeric boundary; characterize |

---

## 1.7 CSV batch-size and row-position partitions

| Partition ID | Partition | Example | Expected / oracle |
| --- | --- | --- | --- |
| CSV-BATCH-01 | One valid row | header + 1 valid row | Valid import candidate |
| CSV-BATCH-02 | Multiple all-valid rows | header + 2+ valid rows | All rows should persist if import succeeds |
| CSV-BATCH-03 | First data row invalid | row 1 invalid, later rows valid | Entire batch rollback; zero imported rows |
| CSV-BATCH-04 | Middle row invalid | valid, invalid, valid | Entire batch rollback; zero imported rows |
| CSV-BATCH-05 | Last row invalid | valid rows then invalid final row | Entire batch rollback; zero imported rows |
| CSV-BATCH-06 | Multiple invalid rows | several invalid rows | Entire batch rollback; clear failure reasons expected at business-report level |
| CSV-BATCH-07 | Zero data rows | header only | Acceptance unresolved; no batch-minimum specified |
| CSV-BATCH-08 | Large row count | generated safe large fixture | No maximum defined; performance/robustness characterization only |
| CSV-BATCH-09 | Duplicate identical rows | same product repeated | Duplicate semantics UNRESOLVED; characterize |
| CSV-BATCH-10 | Duplicate product name, differing fields | repeated name | Duplicate semantics UNRESOLVED; characterize |

Row-position partitions CSV-BATCH-03..05 are important because rollback must hold regardless of where the invalid row appears.

---

# 2. JSON `products[]` API-contract surface

Documented body:

```json
{
  "products": [
    {
      "name": "SP 1",
      "price": 10000,
      "description": "Mô tả 1",
      "imageUrl": "",
      "category_id": 1
    }
  ]
}
```

## 2.1 Top-level request body / `products`

| Partition ID | Partition | Example | Expected / oracle basis | Type |
| --- | --- | --- | --- | --- |
| JSON-TOP-01 | Canonical object with `products` array | `{ "products": [validRow] }` | Documented API shape | CONTRACT-SHAPE VALID |
| JSON-TOP-02 | Missing body | none | No documented import data; exact status UNRESOLVED | MISSING / INVALID SHAPE |
| JSON-TOP-03 | JSON `null` | `null` | Not documented shape; characterize rejection/error | TYPE MISMATCH |
| JSON-TOP-04 | Top-level array | `[validRow]` | Not documented shape | TYPE MISMATCH |
| JSON-TOP-05 | Empty object | `{}` | Missing documented `products` field | MISSING |
| JSON-TOP-06 | `products: []` | empty array | API spec does not define empty-array behavior; characterize | EMPTY / UNRESOLVED |
| JSON-TOP-07 | `products: null` | null | Wrong type relative to shown array | NULL / TYPE MISMATCH |
| JSON-TOP-08 | `products` object instead of array | `{ "products": {} }` | Wrong type | TYPE MISMATCH |
| JSON-TOP-09 | `products` scalar/string | `{ "products": "x" }` | Wrong type | TYPE MISMATCH |
| JSON-TOP-10 | Additional top-level field | `{ "products": [...], "foo": "bar" }` | Additional-field handling not specified; characterize | ROBUSTNESS |
| JSON-TOP-11 | Duplicate `products` JSON keys | two `products` keys | Parser precedence/security characterization; no contract precedence invented | PARSER / SECURITY |
| JSON-TOP-12 | Malformed JSON | `{invalid` | Parser/error characterization; exact status UNRESOLVED | MALFORMED |
| JSON-TOP-13 | Very large products array | many controlled rows | No documented maximum; robustness/performance only | ROBUSTNESS |

---

## 2.2 JSON row object shape

| Partition ID | Partition | Example | Expected / oracle | Type |
| --- | --- | --- | --- | --- |
| JSON-ROW-01 | Complete documented row | all five documented fields | Canonical API row shape | CONTRACT-SHAPE VALID |
| JSON-ROW-02 | Empty object row | `{}` | Violates at least FR-16 non-empty `name` and positive `price` | CONTRACT-BACKED INVALID |
| JSON-ROW-03 | Row is `null` | `null` | Wrong row type; robustness/type handling | TYPE MISMATCH |
| JSON-ROW-04 | Row is array | `[]` | Wrong row type | TYPE MISMATCH |
| JSON-ROW-05 | Row is scalar/string | `"x"` | Wrong row type | TYPE MISMATCH |
| JSON-ROW-06 | Extra benign field | `{..., "foo":"bar"}` | Additional property semantics UNRESOLVED | ROBUSTNESS |
| JSON-ROW-07 | Attempted privileged/system field | `{..., "id":999, "role":"admin"}` | Must not cause unrelated privileged mutation; mass-assignment risk characterization | SECURITY CHARACTERIZATION |

---

## 2.3 JSON row `name`

Direct FR-16 validation applies regardless of transport if this endpoint is used to implement the import business operation.

| Partition ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| JSON-NAME-01 | Non-empty string | `"SP 1"` | Valid wrt FR-16 name rule |
| JSON-NAME-02 | Empty string | `""` | Invalid; if treated as FR-16 import row, entire batch rollback |
| JSON-NAME-03 | Missing `name` | field absent | Invalid under FR-16 non-empty name requirement |
| JSON-NAME-04 | `null` | `null` | Not a non-empty name; invalid |
| JSON-NAME-05 | Whitespace-only string | `"   "` | Trimming semantics unresolved |
| JSON-NAME-06 | Number | `123` | Type requirement not explicitly documented; type robustness characterization |
| JSON-NAME-07 | Boolean | `true` | Type robustness characterization |
| JSON-NAME-08 | Object/array | `{}`, `[]` | Type robustness characterization |
| JSON-NAME-09 | Unicode/Vietnamese | `"Cà phê sữa"` | Non-empty valid representative |
| JSON-NAME-10 | >255 chars | generated long string | FR-15 cross-requirement candidate only; FR-16 inheritance unresolved |
| JSON-NAME-11 | HTML/script-like | `"<script>..."` | Import/API acceptance characterization; UI safety belongs SEC-04 later |

---

## 2.4 JSON row `price`

| Partition ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| JSON-PRICE-01 | Positive integer | `10000` | Valid |
| JSON-PRICE-02 | `1` | `1` | Positive boundary valid |
| JSON-PRICE-03 | Zero | `0` | Invalid; rollback |
| JSON-PRICE-04 | Negative | `-1` | Invalid; rollback |
| JSON-PRICE-05 | Positive decimal | `1.5` | Positive number; valid wrt FR-16 sign constraint |
| JSON-PRICE-06 | Missing field | absent | Not a supplied positive number; invalid under business validation intent |
| JSON-PRICE-07 | `null` | null | Invalid / not positive number |
| JSON-PRICE-08 | Numeric string | `"10000"` | JSON type coercion behavior not specified; characterize |
| JSON-PRICE-09 | Non-numeric string | `"abc"` | Not a positive number; invalid |
| JSON-PRICE-10 | Boolean | `true` | Type mismatch/robustness |
| JSON-PRICE-11 | Object/array | `{}`, `[]` | Type mismatch/robustness |
| JSON-PRICE-12 | Very large positive numeric literal | large value | No max documented; storage/overflow characterization |

---

## 2.5 JSON `description`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| JSON-DESC-01 | Ordinary string | `"Mô tả"` | Normal documented type example |
| JSON-DESC-02 | Empty string | `""` | No FR-16 prohibition |
| JSON-DESC-03 | Missing field | absent | Requirement does not state mandatory; characterize |
| JSON-DESC-04 | `null` | null | Nullability unspecified |
| JSON-DESC-05 | Number/object/array | non-string | Type behavior unspecified; characterize |
| JSON-DESC-06 | Comma-containing string | `"Mô tả, chi tiết"` | JSON needs no CSV quoting; valid JSON string, useful contrast with CSV surface |
| JSON-DESC-07 | HTML/script-like | script text | SEC-04 downstream/UI characterization only |

---

## 2.6 JSON `imageUrl`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| JSON-IMG-01 | Empty string | `""` | Explicitly shown in API example; valid documented representative |
| JSON-IMG-02 | URL-looking string | `"https://example.test/a.png"` | Characterize normal value |
| JSON-IMG-03 | Missing field | absent | Mandatory status unresolved |
| JSON-IMG-04 | `null` | null | Nullability unresolved |
| JSON-IMG-05 | Non-string | number/object | Type behavior unresolved |
| JSON-IMG-06 | Malformed URL-looking string | `"not-a-url"` | No URL validation rule documented |

---

## 2.7 JSON `category_id`

| ID | Partition | Example | Expected |
| --- | --- | --- | --- |
| JSON-CAT-01 | Existing category ID | known fixture | Normal representative |
| JSON-CAT-02 | Missing field | absent | FR-16 direct validity unresolved |
| JSON-CAT-03 | `null` | null | Nullability unresolved |
| JSON-CAT-04 | Non-existing positive ID | controlled missing ID | FR-15 inheritance unresolved; characterize/cross-requirement |
| JSON-CAT-05 | Zero | `0` | No FR-16 numeric boundary |
| JSON-CAT-06 | Negative | `-1` | No FR-16 numeric boundary |
| JSON-CAT-07 | String | `"1"` | Type coercion unresolved |
| JSON-CAT-08 | Non-numeric string | `"abc"` | Type robustness |
| JSON-CAT-09 | Object/array | `{}`, `[]` | Type robustness |

---

## 2.8 JSON batch composition / atomicity

| Partition ID | Partition | Example | Expected / oracle |
| --- | --- | --- | --- |
| JSON-BATCH-01 | One valid row | `[valid1]` | Valid import candidate |
| JSON-BATCH-02 | Multiple all-valid rows | `[valid1, valid2]` | All persist together on successful import |
| JSON-BATCH-03 | First row invalid, later valid | `[invalid, valid]` | FR-16 atomicity: zero rows from batch persist |
| JSON-BATCH-04 | Middle row invalid | `[valid, invalid, valid]` | Zero rows persist |
| JSON-BATCH-05 | Last row invalid | `[valid, invalid]` | Zero rows persist |
| JSON-BATCH-06 | Multiple invalid rows | several invalid rows | Zero rows persist; business report should identify failures clearly |
| JSON-BATCH-07 | Duplicate identical row objects | repeated row | Duplicate semantics unresolved |
| JSON-BATCH-08 | Same name, different values | repeated name | Duplicate semantics unresolved |
| JSON-BATCH-09 | Mixed row types | `[valid, null, "x"]` | Type/validation failure should not produce partial persistence if treated under FR-16 import semantics |
| JSON-BATCH-10 | Very large valid array | generated | No max documented; robustness/performance only |

---

# 3. Authentication / authorization partitions

These apply to the selected endpoint regardless of CSV-vs-JSON contract conflict.

## 3.1 Authorization header

| Partition ID | Partition | Example | Expected | Type |
| --- | --- | --- | --- | --- |
| AUTH-01 | Valid admin JWT | `Bearer <admin-token>` | May proceed to request validation/import | CONTRACT-BACKED VALID |
| AUTH-02 | Header omitted | no Authorization | Must not authorize import | SEC-02 / INVALID |
| AUTH-03 | Empty Authorization | empty value | Must not authenticate | AUTH NEGATIVE |
| AUTH-04 | `Bearer` with no token | `Bearer` | Must not authenticate | AUTH NEGATIVE |
| AUTH-05 | Malformed token | `Bearer not-a-jwt` | Must not authenticate | SEC-02 |
| AUTH-06 | Tampered-signature JWT | modified token | Must not authenticate | SEC-02 SECURITY |
| AUTH-07 | Expired JWT if reproducible | expired token | Must not authenticate; conditional on runtime fixture | SEC-02 / CONDITIONAL |
| AUTH-08 | Valid non-admin user JWT | regular user token | Must not authorize import | FR-12 + SEC-03 DIRECT |
| AUTH-09 | Wrong auth scheme | `Basic ...` | Must not count as valid JWT authentication | AUTH NEGATIVE |
| AUTH-10 | Duplicate Authorization headers if tooling permits | two values | Parser/security characterization; no precedence invented | SECURITY CHARACTERIZATION |

## 3.2 Role boundary

The key semantic authorization boundary is:

```text
valid JWT + role=admin     -> may reach import validation
valid JWT + role!=admin    -> must not authorize import
```

This is a direct FR-12 / SEC-03 boundary and should be prioritized in testcase generation.

---

# 4. Content-Type / transport partitions

Because Gate A preserves a contract conflict, transport itself is a test dimension.

| Partition ID | Surface | Partition | Example | Expected / interpretation |
| --- | --- | --- | --- | --- |
| TRANS-01 | JSON API | `application/json` + canonical JSON body | documented API request shape | API CONTRACT VALID |
| TRANS-02 | JSON API | missing Content-Type with JSON body | handling not specified; characterize | UNRESOLVED |
| TRANS-03 | JSON API | malformed JSON with `application/json` | parser failure characterization | ROBUSTNESS |
| TRANS-04 | CSV business | CSV file upload via real UI/workflow if available | FR-16 intended transport | BUSINESS CONTRACT VALID |
| TRANS-05 | Endpoint | multipart CSV sent directly to endpoint | API spec does not document multipart; use only to characterize contract mismatch, not invent acceptance | CONFLICT CHARACTERIZATION |
| TRANS-06 | Endpoint | text/csv raw body | not documented by API spec; characterization only | CONFLICT CHARACTERIZATION |
| TRANS-07 | Endpoint | JSON body representing CSV-derived products | documented API surface and likely frontend-to-backend bridge | API CONTRACT / WORKFLOW BRIDGE |

---

# 5. `X-Student-Id` project-header partition

Official execution must contain:

```http
X-Student-Id: 23127194
```

| Partition ID | Input | Expected |
| --- | --- | --- |
| SID-01 | Exact required header on every official request | Evidence requirement satisfied |

Do not invent negative SUT expectations for missing/wrong `X-Student-Id` unless the assignment explicitly requires the SUT to validate it.

---

# 6. High-value cross-partitions

These combinations test interaction among transport, role, row validity, and rollback.

| Cross ID | Auth | Surface | Batch | Core expectation |
| --- | --- | --- | --- | --- |
| CROSS-01 | Admin | JSON | one valid row | Import may succeed; row persists |
| CROSS-02 | Admin | JSON | all-valid multi-row | All rows persist |
| CROSS-03 | Admin | JSON | one invalid name among valid rows | Zero rows persist — FR-16 rollback |
| CROSS-04 | Admin | JSON | one zero/negative price among valid rows | Zero rows persist — FR-16 rollback |
| CROSS-05 | Non-admin valid JWT | JSON | valid rows | Import must not be authorized; zero rows persist |
| CROSS-06 | Missing/invalid JWT | JSON | valid rows | Import must not be authorized; zero rows persist |
| CROSS-07 | Admin | CSV workflow | exact header + quoted comma + valid rows | Business-compliant import should succeed |
| CROSS-08 | Admin | CSV workflow | wrong header | Must not produce compliant import; zero rows persist |
| CROSS-09 | Admin | CSV workflow | malformed quote | Must not produce partial import |
| CROSS-10 | Admin | CSV workflow | valid rows + one invalid price | Entire batch rollback |
| CROSS-11 | Admin | CSV workflow | valid rows + invalid last row | Entire batch rollback despite prior valid rows |
| CROSS-12 | Non-admin | CSV workflow | otherwise valid CSV | Must not authorize import |

---

# 7. Boundary policy

## Contract-backed boundaries

The following boundaries are directly defined:

1. **Price sign boundary**
   - valid: `price > 0`
   - invalid: `price <= 0`

2. **Role boundary**
   - valid authorization: JWT with `role='admin'`
   - invalid authorization: valid JWT without admin role

3. **Header exactness boundary**
   - valid: exactly `name,price,description,imageUrl,category_id`
   - invalid: missing/extra/reordered/case-altered header relative to the explicit exact-header requirement

4. **Atomicity boundary**
   - all rows valid -> batch may persist
   - any row invalid -> zero rows from batch may persist

## Unresolved/non-contract numerical boundaries

Do **not** invent mandatory limits for:

- file size;
- CSV row count;
- JSON array length;
- description length;
- image URL length;
- category ID range;
- price maximum;
- FR-16 name maximum unless Gate B explicitly adopts FR-15 inheritance.

Long/large representatives are robustness probes only.

---

# 8. Preliminary coverage map

| Dimension | Partitions |
| --- | --- |
| CSV file/extension | CSV-FILE-01..08 |
| CSV exact header | CSV-HDR-01..10 |
| RFC4180/parser | CSV-PARSE-01..11 |
| CSV name | CSV-NAME-01..10 |
| CSV price | CSV-PRICE-01..12 |
| CSV optional/unclear fields | CSV-DESC-*, CSV-IMG-*, CSV-CAT-* |
| CSV batch/rollback | CSV-BATCH-01..10 |
| JSON top-level/body shape | JSON-TOP-01..13 |
| JSON row shape | JSON-ROW-01..07 |
| JSON name | JSON-NAME-01..11 |
| JSON price | JSON-PRICE-01..12 |
| JSON description/image/category | JSON-DESC-*, JSON-IMG-*, JSON-CAT-* |
| JSON batch/rollback | JSON-BATCH-01..10 |
| Authentication | AUTH-01..10 |
| Admin role escalation | AUTH-08 + role boundary |
| Transport conflict | TRANS-01..07 |
| Project header | SID-01 |
| Cross-surface/high-value combinations | CROSS-01..12 |

---

# 9. Human Gate B review checklist

Please review before Step C:

1. Accept the dual-surface partition model: CSV business contract and JSON `products[]` API contract remain separate but both are covered.
2. Accept CSV header tests as exact-match contract coverage, including missing/extra/reordered/case-changed header cases.
3. Accept RFC4180 core coverage for quoted commas and doubled quotes; multiline/line-ending behavior remains characterization where FR-16 is less explicit.
4. Accept `name` empty and `price <= 0` as direct invalid partitions with the FR-16 rollback oracle.
5. Accept `price=1` vs `price=0` as the primary numeric boundary; no undocumented maximum price is invented.
6. Keep whitespace trimming, duplicate semantics, file-size limits, row-count limits, JSON additional-field behavior, and transport parser details as `UNRESOLVED`/characterization.
7. Keep FR-15-only constraints (`name <= 255`, existing category) as cross-requirement candidates, not mandatory FR-16 partitions unless you explicitly approve inheritance.
8. Accept `AUTH-08` as direct role-escalation coverage: a valid non-admin JWT must not authorize this `/api/admin/*` import endpoint.
9. Accept the atomicity cross-partitions: invalid first/middle/last row must all produce the same persistence invariant — zero rows from that batch persist.
10. Accept multipart/raw-CSV calls to the selected endpoint only as contract-conflict characterization unless the actual frontend workflow proves that transport is directly supported.
11. `X-Student-Id` remains positive official-execution evidence coverage only.

Do not proceed to Step C until Human Gate B is approved.