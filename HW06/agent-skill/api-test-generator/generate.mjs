#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const VERSION = '1.0.0';

function usage() {
  console.log(`Usage:
  node generate.mjs --spec <path> --endpoint "METHOD /path" [--fr FRxx]
                    [--security "text"] [--format json|markdown] [--out <path>]
`);
}

function parseArgs(argv) {
  const out = { format: 'json', fr: '', security: '', out: '' };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const v = argv[i + 1];
    if (v == null || v.startsWith('--')) throw new Error(`Missing value for ${k}`);
    out[k.slice(2)] = v;
    i++;
  }
  if (!out.spec || !out.endpoint) throw new Error('--spec and --endpoint are required');
  if (!['json', 'markdown'].includes(out.format)) throw new Error('--format must be json or markdown');
  return out;
}

function normalizeEndpoint(s) {
  const m = String(s).trim().match(/^([A-Za-z]+)\s+(.+)$/);
  if (!m) throw new Error(`Invalid endpoint: ${s}`);
  return { method: m[1].toUpperCase(), path: m[2].trim() };
}

function lineNumbered(text) {
  return text.split(/\r?\n/).map((text, i) => ({ line: i + 1, text }));
}

function extractSection(specText, endpoint) {
  const lines = lineNumbered(specText);
  const needle = `\`${endpoint.method} ${endpoint.path}\``;
  let idx = lines.findIndex(x => x.text.includes(needle));
  if (idx < 0) idx = lines.findIndex(x => x.text.includes(`${endpoint.method} ${endpoint.path}`));
  if (idx < 0) return null;

  let start = idx;
  while (start > 0 && !/^###\s+/.test(lines[start].text)) start--;
  if (!/^###\s+/.test(lines[start].text)) start = idx;

  let end = idx + 1;
  while (end < lines.length && !/^###\s+/.test(lines[end].text) && !/^---\s*$/.test(lines[end].text)) end++;

  // Include the immediate parent note above the subsection when it states auth/admin requirements.
  let parentStart = start;
  for (let j = start - 1; j >= Math.max(0, start - 14); j--) {
    if (/^##\s+/.test(lines[j].text)) break;
    if (/Authorization|Admin|Token|quyền/i.test(lines[j].text)) parentStart = j;
  }

  return {
    startLine: lines[parentStart].line,
    endLine: lines[end - 1]?.line ?? lines[idx].line,
    heading: lines[start].text.replace(/^###\s+/, '').trim(),
    endpointLine: lines[idx].line,
    text: lines.slice(parentStart, end).map(x => x.text).join('\n').trim(),
    evidence: lines.slice(parentStart, end).filter(x => x.text.trim()).map(x => ({ line: x.line, text: x.text.trim() })),
  };
}

function extractJsonBlock(sectionText) {
  const m = sectionText.match(/```json\s*([\s\S]*?)```/i);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return { __raw: m[1].trim(), __parseError: true }; }
}

function discoverFields(value, prefix = '') {
  const fields = [];
  if (Array.isArray(value)) {
    if (!prefix) fields.push({ name: '[]', kind: 'array', exampleLength: value.length });
    if (value[0] !== undefined) fields.push(...discoverFields(value[0], `${prefix}[]`));
    return fields;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const name = prefix ? `${prefix}.${k}` : k;
      fields.push({ name, kind: Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v, example: Array.isArray(v) || (v && typeof v === 'object') ? undefined : v });
      if (Array.isArray(v) || (v && typeof v === 'object')) fields.push(...discoverFields(v, name));
    }
  }
  return fields;
}

function pathParameters(endpointPath) {
  return [...endpointPath.matchAll(/:([A-Za-z0-9_]+)/g)].map(m => m[1]);
}

function parseQueryObservations(sectionText) {
  const found = [];
  for (const m of sectionText.matchAll(/\?([A-Za-z0-9_]+)=([^\s`]+)/g)) {
    found.push({ name: m[1], example: m[2], optional: /Tùy chọn|optional/i.test(sectionText) });
  }
  return found;
}

function authModel(sectionText, securityInput) {
  const combined = `${sectionText}\n${securityInput}`;
  return {
    bearerTokenDocumented: /Authorization\s*:\s*Bearer|JWT|valid JWT|Token/i.test(combined),
    adminRoleDocumented: /Admin|role\s*=\s*['"]?admin|admin role/i.test(combined),
    securityInput: securityInput || null,
  };
}

function responseObservations(sectionText) {
  // Require a recognizable HTTP reason phrase so ordinary values such as price=10000
  // cannot be misclassified as status 100.
  const statuses = [...sectionText.matchAll(/\b([1-5][0-9]{2})\s+(?:OK|Created|Accepted|No Content|Bad Request|Unauthorized|Forbidden|Not Found|Conflict|Unprocessable Entity|Too Many Requests|Internal Server Error|Bad Gateway|Service Unavailable)\b/gi)].map(m => Number(m[1]));
  return { documentedStatuses: [...new Set(statuses)], exactSchemaDocumented: /Phản hồi|response|Trả về/i.test(sectionText) };
}

function makeCandidate(id, title, category, stimulus, oracle, support, unresolved = []) {
  return {
    id,
    title,
    category,
    source: 'AI_CANDIDATE',
    reviewStatus: 'PENDING_HUMAN_REVIEW',
    stimulus,
    oracle,
    support,
    unresolved,
    confidence: unresolved.length ? 'MEDIUM' : 'HIGH',
    needsHumanReview: true,
  };
}

function generateCandidates(endpointModel) {
  const out = [];
  let n = 1;
  const add = (title, category, stimulus, oracle, support, unresolved=[]) => {
    out.push(makeCandidate(`GEN-${String(n++).padStart(3,'0')}`, title, category, stimulus, oracle, support, unresolved));
  };

  add('Canonical documented request', 'Functional', 'Send the documented example/request shape.', 'Characterize the response; assert only explicitly documented contract facts.', 'documented endpoint + example');

  for (const p of endpointModel.pathParameters) {
    add(`${p}: representative nominal value`, 'Domain', `Use a plausible identifier for :${p}.`, 'Endpoint handles the documented path parameter without parser confusion.', `path parameter :${p}`, ['exact valid identifier domain not documented']);
    add(`${p}: zero`, 'Boundary', `Set :${p} = 0.`, 'Characterize rejection/lookup behavior without inventing an exact status.', `path parameter :${p}`, ['zero validity not documented', 'exact status/schema unresolved']);
    add(`${p}: negative`, 'Boundary', `Set :${p} = -1.`, 'Characterize rejection/lookup behavior without inventing an exact status.', `path parameter :${p}`, ['negative validity not documented', 'exact status/schema unresolved']);
    add(`${p}: malformed text`, 'Security / Domain', `Set :${p} to a non-numeric/special-character probe.`, 'Must not cause unintended data access or mutation; characterize parser response.', `path parameter :${p}`, ['parameter type may be undocumented']);
  }

  for (const q of endpointModel.queryParameters) {
    if (q.optional) add(`${q.name}: omitted`, 'Domain', `Omit query parameter ${q.name}.`, 'Verify documented optional behavior only.', `optional query ${q.name}`);
    add(`${q.name}: nominal`, 'Domain', `Set ${q.name} to a representative value.`, 'Verify behavior consistent with the documented purpose.', `query ${q.name}`);
    add(`${q.name}: empty`, 'Boundary', `Set ${q.name} to empty string.`, 'Characterize behavior; do not invent trimming/empty semantics.', `query ${q.name}`, ['empty-value semantics unresolved']);
  }

  const topBodyFields = endpointModel.bodyFields.filter(f => !f.name.includes('.') && !f.name.includes('[]'));
  for (const f of topBodyFields) {
    add(`Body field ${f.name}: omitted`, 'Domain', `Omit top-level field ${f.name}.`, 'Characterize validation; exact rejection status is asserted only if documented.', `documented body field ${f.name}`, ['requiredness may be unresolved', 'exact failure schema may be unresolved']);
    add(`Body field ${f.name}: null`, 'Boundary', `Set top-level field ${f.name} to null.`, 'Characterize type/null handling; no invented constraint.', `documented body field ${f.name}`, ['nullability unresolved']);
    add(`Body field ${f.name}: wrong type`, 'Boundary', `Replace ${f.name} with an incompatible JSON type.`, 'Request must not produce unintended mutation; characterize response.', `documented body field ${f.name}`, ['exact type validation contract unresolved']);
  }

  if (endpointModel.auth.bearerTokenDocumented) {
    add('Missing bearer token', 'Security', 'Send the request without Authorization.', 'Request must not gain authenticated access; exact status only if documented.', 'authentication requirement', endpointModel.responses.documentedStatuses.length ? [] : ['exact auth failure status/schema unresolved']);
    add('Malformed bearer token', 'Security', 'Send a malformed Bearer token.', 'Malformed credential must not authenticate.', 'authentication requirement', ['exact auth failure status/schema unresolved']);
  }
  if (endpointModel.auth.adminRoleDocumented) {
    add('Valid non-admin actor', 'Security', 'Use a valid JWT for a known non-admin account.', 'Actor must not gain admin-only capability.', 'admin-role requirement', ['exact authorization rejection status/schema unresolved']);
  }

  if (endpointModel.responses.exactSchemaDocumented) {
    add('Documented response schema', 'Schema', 'Send a canonical request.', 'Validate only documented response fields/types/statuses.', 'documented response observation');
  } else {
    add('Response shape characterization', 'Schema', 'Send a canonical request and record status/content type/body shape.', 'Record runtime shape without promoting it to contract.', 'schema not explicitly documented', ['exact response schema unresolved']);
  }

  const key = x => JSON.stringify([x.category, x.stimulus.toLowerCase().replace(/\s+/g,' ').trim(), x.oracle.toLowerCase().replace(/\s+/g,' ').trim()]);
  const seen = new Set();
  return out.filter(x => { const k = key(x); if (seen.has(k)) return false; seen.add(k); return true; });
}

function coverageModel(endpointModel, candidates) {
  const count = cat => candidates.filter(x => x.category.toLowerCase().includes(cat)).length;
  return {
    domain: { status: 'GENERATED', candidates: count('domain') + count('boundary') },
    stateTransition: { status: /status|state|transition|canceled|pending|confirmed|shipping|delivered/i.test(endpointModel.sectionText) ? 'REVIEW_REQUIRED' : 'NOT_DOCUMENTED_FOR_SELECTED_SECTION', candidates: count('state') },
    security: { status: endpointModel.auth.bearerTokenDocumented || endpointModel.auth.adminRoleDocumented ? 'GENERATED' : 'NO_EXPLICIT_REQUIREMENT_FOUND', candidates: count('security') },
    schema: { status: endpointModel.responses.exactSchemaDocumented ? 'DOCUMENTED_OR_PARTIAL' : 'CHARACTERIZATION_ONLY', candidates: count('schema') },
    deduplicatedCandidateCount: candidates.length,
  };
}

function toMarkdown(result) {
  const lines = [];
  lines.push('# Generated API Test Candidates', '');
  lines.push(`- Endpoint: \`${result.endpointModel.method} ${result.endpointModel.path}\``);
  lines.push(`- FR: \`${result.requirementModel.selectedFR || 'UNSPECIFIED'}\``);
  lines.push(`- Gate: **${result.finalizationGate}**`);
  lines.push(`- Candidate count: **${result.candidateTests.length}**`, '');
  lines.push('## Requirement Model', '', '```json', JSON.stringify(result.requirementModel, null, 2), '```', '');
  lines.push('## Coverage Model', '', '```json', JSON.stringify(result.coverageModel, null, 2), '```', '');
  lines.push('## Candidate Tests', '');
  for (const t of result.candidateTests) {
    lines.push(`### ${t.id} — ${t.title}`, '', `- Category: ${t.category}`, `- Source: ${t.source}`, `- Review: ${t.reviewStatus}`, `- Stimulus: ${t.stimulus}`, `- Oracle: ${t.oracle}`);
    if (t.unresolved.length) lines.push(`- Unresolved: ${t.unresolved.join('; ')}`);
    lines.push('');
  }
  return lines.join('\n');
}

function main() {
  let args;
  try { args = parseArgs(process.argv.slice(2)); }
  catch (e) { console.error(`ERROR: ${e.message}`); usage(); process.exit(2); }

  const specPath = path.resolve(args.spec);
  if (!fs.existsSync(specPath)) { console.error(`ERROR: spec not found: ${specPath}`); process.exit(3); }
  const specText = fs.readFileSync(specPath, 'utf8');
  const endpoint = normalizeEndpoint(args.endpoint);
  const section = extractSection(specText, endpoint);
  if (!section) { console.error(`ERROR: endpoint not found exactly in spec: ${endpoint.method} ${endpoint.path}`); process.exit(4); }

  const bodyExample = extractJsonBlock(section.text);
  const bodyFields = bodyExample && !bodyExample.__parseError ? discoverFields(bodyExample) : [];
  const auth = authModel(section.text, args.security);
  const responses = responseObservations(section.text);

  const requirementModel = {
    selectedFR: args.fr || null,
    selectedEndpoint: `${endpoint.method} ${endpoint.path}`,
    source: args.spec,
    sourceLines: { start: section.startLine, end: section.endLine, endpoint: section.endpointLine },
    heading: section.heading,
    sourceEvidence: section.evidence,
    securityRequirementsInput: args.security || null,
    policy: 'Only source-supported facts may become contract assertions; unsupported semantics remain unresolved/characterization.',
  };

  const endpointModel = {
    method: endpoint.method,
    path: endpoint.path,
    pathParameters: pathParameters(endpoint.path),
    queryParameters: parseQueryObservations(section.text),
    bodyExample,
    bodyFields,
    auth,
    responses,
    sectionText: section.text,
    unresolved: [
      ...(responses.documentedStatuses.length ? [] : ['exact success/failure status codes may be unresolved']),
      ...(responses.exactSchemaDocumented ? [] : ['exact response schema unresolved']),
    ],
  };

  const candidates = generateCandidates(endpointModel);
  const result = {
    requirementModel,
    endpointModel,
    coverageModel: coverageModel(endpointModel, candidates),
    candidateTests: candidates,
    auditMetadata: {
      generatedAt: new Date().toISOString(),
      generatorVersion: VERSION,
      specPath: args.spec,
      selectedEndpoint: `${endpoint.method} ${endpoint.path}`,
      selectedFR: args.fr || null,
      securityInput: args.security || null,
      sourceSha256: crypto.createHash('sha256').update(specText).digest('hex'),
      candidateCount: candidates.length,
      unresolvedCandidateCount: candidates.filter(x => x.unresolved.length).length,
      humanReviewRequired: true,
      runtimeEvidenceGenerated: false,
    },
    finalizationGate: 'HUMAN_REVIEW_REQUIRED',
  };

  const rendered = args.format === 'markdown' ? toMarkdown(result) : JSON.stringify(result, null, 2) + '\n';
  if (args.out) {
    const outPath = path.resolve(args.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, rendered);
    console.log(`output=${args.out}`);
  } else {
    process.stdout.write(rendered);
  }
  console.log(`candidates=${candidates.length}`);
  console.log(`human_review_required=true`);
}

main();
