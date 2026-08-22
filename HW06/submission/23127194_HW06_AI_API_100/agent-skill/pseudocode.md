# AI-Driven API Test Generator — Pseudocode

```text
FUNCTION generateApiTests(specPath, selectedEndpoint, selectedFR, securityRequirements, outputFormat):
    specText ← READ specPath

    endpointSection ← FIND_EXACT_ENDPOINT_SECTION(specText, selectedEndpoint)
    IF endpointSection not found:
        STOP with explicit error

    requirementModel ← PARSE_REQUIREMENTS(endpointSection)
    requirementModel.selectedFR ← selectedFR
    requirementModel.securityRequirements ← PARSE_SECURITY_INPUT(securityRequirements)

    endpointModel ← BUILD_ENDPOINT_MODEL(requirementModel)
        method
        path
        path parameters
        query parameters
        body fields
        auth observations
        documented response observations
        unresolved semantics

    coverageModel ← EMPTY coverage matrix

    candidateTests ← []

    ADD canonical happy-path candidate when spec supports one

    FOR EACH path parameter:
        ADD representative valid candidate
        ADD zero / negative / malformed candidates when type semantics are unknown
        MARK exact validity oracle as NEEDS_HUMAN_REVIEW unless documented
        UPDATE coverageModel.domain

    FOR EACH query parameter:
        ADD omitted candidate when optional
        ADD nominal candidate
        ADD empty / unusual value characterization candidates
        UPDATE coverageModel.domain

    FOR EACH body field:
        ADD canonical documented value candidate
        ADD missing / null / wrong-type candidates
        DO NOT invent min/max/format constraints not present in source
        UPDATE coverageModel.boundary

    IF authentication is documented:
        ADD missing-token candidate
        ADD malformed-token candidate
        UPDATE coverageModel.security

    IF admin role is documented:
        ADD valid-non-admin candidate
        MARK role rejection status/schema unresolved unless explicitly documented
        UPDATE coverageModel.security

    IF state vocabulary or transition semantics are documented:
        ADD allowed-transition candidates
        ADD forbidden-transition candidates
        UPDATE coverageModel.state
    ELSE:
        coverageModel.state.status ← NOT_APPLICABLE_OR_UNRESOLVED

    IF response structure is documented:
        ADD schema candidates limited to documented fields/types/statuses
        UPDATE coverageModel.schema
    ELSE:
        ADD response-characterization candidate
        MARK exact schema/status as UNRESOLVED

    candidateTests ← DEDUPLICATE(candidateTests by normalized intent + input shape)

    FOR EACH candidate IN candidateTests:
        candidate.source ← AI_CANDIDATE
        candidate.reviewStatus ← PENDING_HUMAN_REVIEW
        candidate.confidence ← CALCULATE_FROM_SOURCE_SUPPORT(candidate)
        candidate.sourceEvidence ← exact source-derived observations
        candidate.assumptions ← explicit assumptions only
        candidate.unresolved ← unsupported or ambiguous expectations

    coverageModel ← ANALYZE_COVERAGE(candidateTests, endpointModel)

    auditMetadata ← {
        generatedAt,
        generatorVersion,
        specPath,
        selectedEndpoint,
        selectedFR,
        securityInput,
        sourceHash,
        candidateCount,
        unresolvedCount,
        humanReviewRequired: true
    }

    result ← {
        requirementModel,
        endpointModel,
        coverageModel,
        candidateTests,
        auditMetadata,
        finalizationGate: "HUMAN_REVIEW_REQUIRED"
    }

    WRITE result in requested outputFormat
    RETURN result
```

## Human Review Gate

The generator must never silently promote a candidate into a final testcase.

```text
AI_CANDIDATE
    ↓
Human checks requirement support
    ↓
VALID / INVALID / INCOMPLETE
    ↓
Correction or gap-fill if required
    ↓
FINAL TESTCASE
```

The human reviewer must specifically reject:

- invented HTTP status codes;
- invented response fields;
- invented validation limits;
- inferred business rules presented as explicit requirements;
- fabricated runtime evidence;
- duplicate cases that differ only in wording.
