#!/usr/bin/env node
import fs from 'fs';
const [reportPath, mode] = process.argv.slice(2);
if (!reportPath || !['pass','one-fail'].includes(mode)) {
  console.error('Usage: node verify-ci-demo.mjs <report.json> <pass|one-fail>');
  process.exit(2);
}
const r=JSON.parse(fs.readFileSync(reportPath,'utf8'));
const executions=r.run?.executions||[];
const assertions=[];
let sidGood=0;
for(const ex of executions){
  const sid=(ex.request?.header||[]).find(h=>String(h.key).toLowerCase()==='x-student-id');
  if(sid && String(sid.value)==='23127194') sidGood++;
  assertions.push(...(ex.assertions||[]));
}
const failed=assertions.filter(a=>a.error);
const intentional=failed.filter(a=>String(a.assertion||'').includes('CI-DEMO-ONLY'));
console.log(`mode=${mode} requests=${executions.length} assertions=${assertions.length} failed=${failed.length} sid=${sidGood}/${executions.length}`);
if(sidGood!==executions.length) throw new Error('Not every request carries exact X-Student-Id: 23127194');
if(mode==='pass' && failed.length!==0) throw new Error(`Expected zero failures, got ${failed.length}`);
if(mode==='one-fail' && (failed.length!==1 || intentional.length!==1)) throw new Error(`Expected exactly one CI-DEMO-ONLY failure, got ${failed.length}`);
console.log('CI_DEMO_VERIFICATION=PASS');
