#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function usage() {
  console.error('Usage: node scripts/extract-newman-summary.js <newman-report.json> [output-base]');
  process.exit(2);
}

const inputPath = process.argv[2];
if (!inputPath) usage();

const outputBase = process.argv[3] || inputPath.replace(/\.json$/i, '-summary');
const jsonOut = `${outputBase}.json`;
const mdOut = `${outputBase}.md`;

const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const run = report.run || {};
const executions = Array.isArray(run.executions) ? run.executions : [];

const testcasePattern = /\b((?:AI|HUMAN)-FR\d{2}-\d{3})\b/i;
const secretHeaderPattern = /^(authorization|proxy-authorization|cookie|set-cookie|x-api-key)$/i;
const tokenPattern = /(bearer\s+[A-Za-z0-9._~+\/-]+=*|eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)/gi;

function redactText(value) {
  if (value == null) return value;
  return String(value).replace(tokenPattern, '[REDACTED_TOKEN]');
}

function redactHeaders(headers) {
  return (headers || []).map((h) => ({
    key: h.key,
    value: secretHeaderPattern.test(String(h.key || '')) ? '[REDACTED]' : redactText(h.value),
  }));
}

function responseBody(execution, maxLen = 600) {
  const stream = execution?.response?.stream;
  if (!stream) return '';
  let text;
  try {
    if (Buffer.isBuffer(stream)) text = stream.toString('utf8');
    else if (stream?.type === 'Buffer' && Array.isArray(stream.data)) text = Buffer.from(stream.data).toString('utf8');
    else text = String(stream);
  } catch {
    return '[unreadable response body]';
  }
  text = redactText(text).replace(/\s+/g, ' ').trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

function urlString(req) {
  if (!req || !req.url) return '';
  if (typeof req.url === 'string') return req.url;
  if (req.url.raw) return req.url.raw;
  const protocol = req.url.protocol ? `${req.url.protocol}://` : '';
  const host = Array.isArray(req.url.host) ? req.url.host.join('.') : (req.url.host || '');
  const port = req.url.port ? `:${req.url.port}` : '';
  const pathPart = Array.isArray(req.url.path) ? `/${req.url.path.join('/')}` : (req.url.path ? `/${req.url.path}` : '');
  const query = Array.isArray(req.url.query)
    ? req.url.query
        .filter((q) => !q.disabled)
        .map((q) => `${q.key ?? ''}=${q.value ?? ''}`)
        .join('&')
    : '';
  return `${protocol}${host}${port}${pathPart}${query ? `?${query}` : ''}`;
}

const testcaseIds = new Set();
const failedCases = new Map();
let requestsWithStudentHeader = 0;
let correctStudentHeader = 0;
let totalAssertions = 0;
let failedAssertions = 0;

for (const ex of executions) {
  const itemName = ex?.item?.name || '';
  const match = itemName.match(testcasePattern);
  const testcaseId = match ? match[1].toUpperCase() : null;
  if (testcaseId) testcaseIds.add(testcaseId);

  const headers = ex?.request?.header || [];
  const sidHeaders = headers.filter((h) => String(h.key || '').toLowerCase() === 'x-student-id');
  if (sidHeaders.length > 0) requestsWithStudentHeader += 1;
  if (sidHeaders.some((h) => String(h.value) === '23127194')) correctStudentHeader += 1;

  const assertions = Array.isArray(ex.assertions) ? ex.assertions : [];
  totalAssertions += assertions.length;
  const failures = assertions.filter((a) => a && a.error);
  failedAssertions += failures.length;

  if (failures.length > 0) {
    const key = testcaseId || itemName || `execution-${failedCases.size + 1}`;
    if (!failedCases.has(key)) {
      failedCases.set(key, {
        id: testcaseId,
        itemName,
        method: ex?.request?.method || '',
        url: redactText(urlString(ex?.request)),
        status: ex?.response?.code ?? null,
        failedAssertions: [],
        responsePreview: responseBody(ex),
        requestHeaders: redactHeaders(headers).filter((h) => String(h.key || '').toLowerCase() === 'x-student-id'),
      });
    }
    const target = failedCases.get(key);
    for (const failure of failures) {
      target.failedAssertions.push({
        assertion: failure.assertion || '(unnamed assertion)',
        message: redactText(failure.error?.message || ''),
      });
    }
  }
}

const stats = run.stats || {};
const statRequestsTotal = stats.requests?.total;
const statAssertionsTotal = stats.assertions?.total;
const statAssertionsFailed = stats.assertions?.failed;

const summary = {
  sourceReport: path.relative(process.cwd(), inputPath),
  generatedAt: new Date().toISOString(),
  testcaseIds: testcaseIds.size,
  requests: Number.isFinite(statRequestsTotal) ? statRequestsTotal : executions.length,
  assertions: Number.isFinite(statAssertionsTotal) ? statAssertionsTotal : totalAssertions,
  passedAssertions: (Number.isFinite(statAssertionsTotal) ? statAssertionsTotal : totalAssertions) -
    (Number.isFinite(statAssertionsFailed) ? statAssertionsFailed : failedAssertions),
  failedAssertions: Number.isFinite(statAssertionsFailed) ? statAssertionsFailed : failedAssertions,
  failedTestcaseIds: [...new Set([...failedCases.values()].map((x) => x.id).filter(Boolean))],
  failedCases: [...failedCases.values()],
  studentHeader: {
    expected: '23127194',
    executionsWithHeader: requestsWithStudentHeader,
    executionsWithExpectedValue: correctStudentHeader,
    totalExecutions: executions.length,
    allExecutionsMatch: executions.length > 0 && correctStudentHeader === executions.length,
  },
};

fs.mkdirSync(path.dirname(jsonOut), { recursive: true });
fs.writeFileSync(jsonOut, `${JSON.stringify(summary, null, 2)}\n`);

const lines = [];
lines.push('# Newman Execution Summary');
lines.push('');
lines.push(`Source: \`${summary.sourceReport}\``);
lines.push('');
lines.push('| Metric | Result |');
lines.push('| --- | ---: |');
lines.push(`| Testcase IDs | ${summary.testcaseIds} |`);
lines.push(`| Requests | ${summary.requests} |`);
lines.push(`| Assertions | ${summary.assertions} |`);
lines.push(`| Assertions passed | ${summary.passedAssertions} |`);
lines.push(`| Assertions failed | ${summary.failedAssertions} |`);
lines.push(`| Failed testcase IDs | ${summary.failedTestcaseIds.length} |`);
lines.push(`| X-Student-Id exact match | ${summary.studentHeader.executionsWithExpectedValue}/${summary.studentHeader.totalExecutions} |`);
lines.push('');

if (summary.failedCases.length === 0) {
  lines.push('## Failures');
  lines.push('');
  lines.push('No failed assertions were found.');
} else {
  lines.push('## Failures only');
  lines.push('');
  for (const f of summary.failedCases) {
    lines.push(`### ${f.id || f.itemName}`);
    lines.push('');
    lines.push(`- Request: \`${f.method} ${f.url}\``);
    lines.push(`- HTTP status: ${f.status ?? 'N/A'}`);
    for (const a of f.failedAssertions) {
      lines.push(`- Failed assertion: ${a.assertion}${a.message ? ` — ${a.message}` : ''}`);
    }
    if (f.responsePreview) lines.push(`- Response preview: \`${f.responsePreview.replace(/`/g, '\\`')}\``);
    lines.push('');
  }
}

lines.push('## AI-consumption rule');
lines.push('');
lines.push('Use this compact summary for Step K/Gate G reasoning. Keep the raw Newman JSON/HTML/CLI files as execution evidence, but do not load them into AI context unless a specific failed case requires deeper inspection.');
lines.push('');

fs.writeFileSync(mdOut, `${lines.join('\n')}\n`);

console.log(`summary_json=${jsonOut}`);
console.log(`summary_md=${mdOut}`);
console.log(`testcase_ids=${summary.testcaseIds}`);
console.log(`requests=${summary.requests}`);
console.log(`assertions=${summary.assertions}`);
console.log(`failed_assertions=${summary.failedAssertions}`);
console.log(`failed_testcase_ids=${summary.failedTestcaseIds.join(',') || 'none'}`);
console.log(`student_header=${summary.studentHeader.executionsWithExpectedValue}/${summary.studentHeader.totalExecutions}`);
