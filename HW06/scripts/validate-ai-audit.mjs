#!/usr/bin/env node
import fs from 'fs';

const file = process.argv[2] || 'reports/ai-audit-report.md';
const text = fs.readFileSync(file, 'utf8');
const marker = /^## AI Audit Entry - (AI-\d+)\n/gm;
const matches = [...text.matchAll(marker)];

function field(block, names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = block.match(new RegExp(`^\\| ${escaped} \\| (.*?) \\|$`, 'm'));
    if (m) return m[1];
  }
  return null;
}

const rows = matches.map((m, i) => {
  const end = i + 1 < matches.length ? matches[i + 1].index : text.length;
  const block = text.slice(m.index, end);
  return {
    id: m[1],
    tool: field(block, ['AI Tool']),
    dateTime: field(block, ['Date and Time']),
    prompt: field(block, ['User Prompt', 'User Decision / Prompt', 'User Decision', 'User Input']),
    output: field(block, ['AI Output']),
    artifact: field(block, ['Generated/Modified Files']),
    humanReview: /Human Review(?:\s*\/[^:]*)?:|### Human Review Addendum/m.test(block),
  };
});

const required = ['tool', 'dateTime', 'prompt', 'output', 'artifact'];
let ok = true;
for (const key of required) {
  const missing = rows.filter(r => !r[key]).map(r => r.id);
  console.log(`${key}=${rows.length - missing.length}/${rows.length}`);
  if (missing.length) {
    ok = false;
    console.log(`missing_${key}=${missing.join(',')}`);
  }
}

const noReview = rows.filter(r => !r.humanReview).map(r => r.id);
console.log(`humanReview=${rows.length - noReview.length}/${rows.length}`);
if (noReview.length) {
  ok = false;
  console.log(`missing_humanReview=${noReview.join(',')}`);
}

const counts = new Map();
for (const r of rows) counts.set(r.id, (counts.get(r.id) || 0) + 1);
const duplicates = [...counts.entries()].filter(([, n]) => n > 1);
console.log(`occurrences=${rows.length}`);
console.log(`uniqueIds=${counts.size}`);
console.log(`duplicateIds=${duplicates.map(([id, n]) => `${id}x${n}`).join(',') || 'none'}`);

const nums = [...counts.keys()].map(id => Number(id.slice(3))).sort((a, b) => a - b);
const missingNumbers = [];
if (nums.length) {
  for (let n = nums[0]; n <= nums[nums.length - 1]; n++) {
    if (!nums.includes(n)) missingNumbers.push(`AI-${String(n).padStart(3, '0')}`);
  }
}
console.log(`missingNumericIds=${missingNumbers.join(',') || 'none'}`);
console.log(`AI_AUDIT_VALIDATION=${ok ? 'PASS' : 'FAIL'}`);
process.exit(ok ? 0 : 1);