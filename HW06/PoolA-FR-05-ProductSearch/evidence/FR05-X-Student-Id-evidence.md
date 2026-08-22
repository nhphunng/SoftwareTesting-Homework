# FR-05 X-Student-Id Evidence

Date: 2026-08-20  
Official execution: `postman/newman/FR05-official-report.json`  
Required header: `X-Student-Id: 23127194`

## Verification result

Programmatic inspection of the **official Newman JSON report** confirms:

- Total recorded executions: **62**
- Executions carrying `X-Student-Id`: **62 / 62**
- Header value on every recorded execution: **23127194**

The official CLI report also records a passing assertion named `required X-Student-Id header` for the executed requests.

Representative CLI evidence is available in:

- `postman/newman/FR05-official-cli.txt`
- `postman/newman/FR05-official-report.json`

## Screenshot status

A real Terminal screenshot was attempted on macOS after displaying the official report verification. macOS blocked programmatic screen capture from the Liebe process (`could not create image from window`), and a second capture attempt launched from Terminal also produced no PNG. No screenshot was fabricated.

Therefore the **header evidence itself is complete and reproducible**, but the assignment-specific GUI/terminal screenshot remains a manual capture action unless Screen Recording permission is granted to the process performing the capture.
