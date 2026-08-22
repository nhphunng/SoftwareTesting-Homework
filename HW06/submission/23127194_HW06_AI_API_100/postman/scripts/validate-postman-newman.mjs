#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SID = '23127194';
const configs = [
  { id: 'FR05', collection: 'postman/collection/HW06-FR05-ProductSearch.postman_collection.json', env: 'postman/environment/HW06-FR05-Local.postman_environment.json' },
  { id: 'FR10', collection: 'postman/collection/HW06-FR10-CancelOrder.postman_collection.json', env: 'postman/environment/HW06-FR10-Local.postman_environment.json' },
  { id: 'FR16', collection: 'postman/collection/HW06-FR16-ImportProducts.postman_collection.json', env: 'postman/environment/HW06-FR16-Local.postman_environment.json' },
];

let failed = false;
function mustExist(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.error(`MISSING ${rel}`); failed = true; return false; }
  return true;
}
function hasJwtLiteral(text) {
  return /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(text);
}

let totalRequests = 0;
let totalAssertions = 0;
let totalFailedAssertions = 0;

for (const cfg of configs) {
  const required = [
    cfg.collection,
    cfg.env,
    `postman/data/${cfg.id}-runtime-data.json`,
    `postman/newman/${cfg.id}-official-cli.txt`,
    `postman/newman/${cfg.id}-official-report.json`,
    `postman/newman/${cfg.id}-official-report.html`,
    `postman/newman/${cfg.id}-official-report.xml`,
    `postman/newman/${cfg.id}-execution-summary.json`,
    `postman/newman/${cfg.id}-execution-summary.md`,
  ];
  for (const f of required) mustExist(f);

  const collectionText = fs.readFileSync(path.join(ROOT, cfg.collection), 'utf8');
  const envText = fs.readFileSync(path.join(ROOT, cfg.env), 'utf8');
  const collection = JSON.parse(collectionText);
  const env = JSON.parse(envText);

  if (hasJwtLiteral(collectionText) || hasJwtLiteral(envText)) {
    console.error(`${cfg.id}: public artifact contains JWT-like literal`);
    failed = true;
  }

  const prerequest = (collection.event || [])
    .filter(e => e.listen === 'prerequest')
    .flatMap(e => e.script?.exec || [])
    .join('\n');
  if (!prerequest.includes('X-Student-Id') || !prerequest.includes(SID)) {
    console.error(`${cfg.id}: collection-level pre-request script does not enforce exact student header`);
    failed = true;
  }

  const envSid = (env.values || []).find(v => v.key === 'studentId' && v.enabled !== false);
  if (!envSid || String(envSid.value) !== SID) {
    console.error(`${cfg.id}: public environment studentId mismatch`);
    failed = true;
  }

  const summaryPath = path.join(ROOT, `postman/newman/${cfg.id}-execution-summary.json`);
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  if (!summary.studentHeader?.allExecutionsMatch || summary.studentHeader?.expected !== SID) {
    console.error(`${cfg.id}: Newman evidence does not show exact student header coverage`);
    failed = true;
  }
  totalRequests += summary.requests || 0;
  totalAssertions += summary.assertions || 0;
  totalFailedAssertions += summary.failedAssertions || 0;

  console.log(`${cfg.id}: OK | IDs=${summary.testcaseIds} requests=${summary.requests} assertions=${summary.assertions} failed=${summary.failedAssertions} SID=${summary.studentHeader.executionsWithExpectedValue}/${summary.studentHeader.totalExecutions}`);
}

console.log(`TOTAL: requests=${totalRequests} assertions=${totalAssertions} failedAssertions=${totalFailedAssertions}`);
if (failed) process.exit(1);
console.log('P10_VALIDATION=PASS');
