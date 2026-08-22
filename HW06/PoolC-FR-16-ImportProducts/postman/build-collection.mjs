import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hw06 = path.resolve(here, '../..');
const collectionPath = path.join(hw06, 'postman/collection/HW06-FR16-ImportProducts.postman_collection.json');
const environmentPath = path.join(hw06, 'postman/environment/HW06-FR16-Local.postman_environment.json');

const STUDENT_ID = '23127194';
const IMPORT_URL = '{{baseUrl}}/api/admin/import-products';
const PRODUCTS_URL = '{{baseUrl}}/api/products';

const aiTitles = {
  '001': 'Canonical JSON import — one valid product',
  '002': 'Canonical JSON import — multiple valid products',
  '003': 'Business CSV workflow — exact header and valid rows',
  '004': 'CSV quoted comma is parsed as data, not delimiter',
  '005': 'Official request carries required student header',
  '006': 'Missing top-level request body',
  '007': 'Top-level JSON null',
  '008': 'Top-level array instead of object',
  '009': 'Missing products field',
  '010': 'Empty products array',
  '011': 'products null',
  '012': 'products object instead of array',
  '013': 'Empty product name in JSON row',
  '014': 'Missing product name in JSON row',
  '015': 'Null product name',
  '016': 'Non-existing category ID — cross-requirement characterization',
  '017': 'Whitespace-only name — trimming semantics characterization',
  '018': 'Price = 1 — positive boundary valid',
  '019': 'Price = 0 — boundary invalid and rollback',
  '020': 'Price = -1 — invalid negative boundary',
  '021': 'Positive decimal price',
  '022': 'Very large positive price — no invented maximum',
  '023': 'Long name >255 — FR-15 inheritance unresolved',
  '024': 'Invalid first row causes full rollback',
  '025': 'Invalid middle row causes full rollback',
  '026': 'Invalid final row causes full rollback',
  '027': 'Multiple invalid rows still yield zero persistence',
  '028': 'Failed batch followed by independent valid batch',
  '029': 'Valid batch A followed by invalid batch B',
  '030': 'Repeat identical valid batch — duplicate/idempotency characterization',
  '031': 'Malformed request followed by canonical valid request',
  '032': 'Missing JWT cannot import',
  '033': 'Malformed JWT cannot import',
  '034': 'Tampered JWT signature cannot import',
  '035': 'Valid non-admin JWT cannot import',
  '036': 'Forged admin role in tampered token does not elevate privilege',
  '037': 'Unexpected body role/admin fields do not elevate actor',
  '038': 'SQL-looking product name remains inert data',
  '039': 'SQL-looking description remains inert data',
  '040': 'CSV formula-like value — risk characterization',
  '041': 'Malformed CSV/parser confusion cannot partially persist',
  '042': 'Record success runtime response shape without promoting it to contract',
  '043': 'Record validation-failure runtime response shape',
  '044': 'Record authentication-failure runtime response shape',
  '045': 'Record non-admin authorization response shape',
  '046': 'DB-error response and disclosure characterization — BLOCKED',
  '047': 'CSV wrong extension is not compliant import',
  '048': 'CSV reordered header violates exact-header contract',
  '049': 'CSV extra header column violates exact-header contract',
  '050': 'CSV doubled quote escaping',
  '051': 'Mixed JSON row types cannot partially persist',
  '052': 'Duplicate JSON keys — parser precedence characterization'
};

const humanTitles = {
  '001': 'Concurrent duplicate import race',
  '003': 'Stale category reference after category deletion',
  '004': 'Reuse of the same JWT after logout/revocation action — TECHNICALLY BLOCKED',
  '005': 'Stale non-admin token after mid-session role promotion — TECHNICALLY BLOCKED',
  '006': 'Repeated identical invalid-batch submissions'
};

function script(listen, exec) {
  return { listen, script: { type: 'text/javascript', exec } };
}

function requestHeaders(auth = 'admin', contentType = true) {
  const headers = [{ key: 'X-Student-Id', value: '{{studentId}}', type: 'text' }];
  if (auth === 'admin') headers.push({ key: 'Authorization', value: 'Bearer {{adminToken}}', type: 'text' });
  if (auth === 'nonAdmin') headers.push({ key: 'Authorization', value: 'Bearer {{nonAdminToken}}', type: 'text' });
  if (auth === 'tampered') headers.push({ key: 'Authorization', value: 'Bearer {{tamperedJwt}}', type: 'text' });
  if (auth === 'forged') headers.push({ key: 'Authorization', value: 'Bearer {{forgedAdminJwt}}', type: 'text' });
  if (auth === 'stale') headers.push({ key: 'Authorization', value: 'Bearer {{staleToken}}', type: 'text' });
  if (contentType) headers.push({ key: 'Content-Type', value: 'application/json', type: 'text' });
  return headers;
}

function description(id, source, text, disposition = 'EXECUTABLE') {
  return [
    `Testcase ID: ${id}`,
    `Source = ${source}`,
    `Step I disposition: ${disposition}`,
    'Exact HTTP status and response schema remain UNRESOLVED unless explicitly contract-backed.',
    'Persistence/state is the primary oracle.',
    text
  ].join('\n');
}

function markerKey(id, suffix = 'A') {
  return `fr16_${id.replaceAll('-', '_')}_${suffix}`;
}

function setupMarkers(id, suffixes = ['A']) {
  const lines = [
    `const __fr16Id=${JSON.stringify(id)};`,
    "const __fr16Nonce=Date.now()+'_'+Math.floor(Math.random()*1000000);"
  ];
  for (const suffix of suffixes) {
    const key = markerKey(id, suffix);
    lines.push(`pm.collectionVariables.set(${JSON.stringify(key)}, 'HW06_'+__fr16Id.replaceAll('-','_')+'_${suffix}_'+__fr16Nonce);`);
  }
  return lines;
}

const productExtract = [
  "function __fr16Rows(j){if(Array.isArray(j))return j;if(j&&Array.isArray(j.products))return j.products;if(j&&Array.isArray(j.data))return j.data;if(j&&Array.isArray(j.items))return j.items;if(j&&j.data&&Array.isArray(j.data.products))return j.data.products;return [];}",
  "function __fr16ExactCount(j,name){return __fr16Rows(j).filter(function(row){return row&&String(row.name)===String(name);}).length;}"
];

function baselineScript(id, suffixes = ['A']) {
  const lines = [...setupMarkers(id, suffixes), ...productExtract];
  for (const suffix of suffixes) {
    const key = markerKey(id, suffix);
    lines.push(
      `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${key}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){`,
      `  pm.test('${id} | baseline marker ${suffix} is absent',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}pm.expect(__fr16ExactCount(j,pm.collectionVariables.get('${key}'))).to.eql(0);});`,
      '});'
    );
  }
  return lines;
}

function oracleScript(id, expectations, extra = []) {
  const lines = [...productExtract];
  for (const [suffix, mode] of Object.entries(expectations)) {
    const key = markerKey(id, suffix);
    lines.push(
      `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${key}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){`,
      `  pm.test('${id} | persistence oracle ${suffix} (${mode})',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}const n=__fr16ExactCount(j,pm.collectionVariables.get('${key}'));${mode === 'absent' ? 'pm.expect(n).to.eql(0);' : mode === 'exactly-one' ? 'pm.expect(n).to.eql(1);' : mode === 'present-or-absent' ? 'pm.expect([0,1]).to.include(n);' : 'pm.expect(n).to.be.at.least(1);'}});`,
      '});'
    );
  }
  return lines.concat(extra);
}

function snapshotBeforeScript(id) {
  const key = `fr16_snapshot_${id.replaceAll('-', '_')}`;
  return [
    ...setupMarkers(id),
    ...productExtract,
    `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}'),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){`,
    `  pm.test('${id} | baseline product snapshot is readable',function(){pm.expect(err).to.equal(null);});`,
    `  if(!err){let j={};try{j=res.json();}catch(e){}const rows=__fr16Rows(j);pm.collectionVariables.set('${key}',JSON.stringify(rows.map(function(r){return r&&r.id!==undefined?'id:'+String(r.id):'name:'+String(r&&r.name);})));}`,
    '});'
  ];
}

function snapshotAfterScript(id, allowedGrowth = [0]) {
  const key = `fr16_snapshot_${id.replaceAll('-', '_')}`;
  return [
    ...productExtract,
    `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}'),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){`,
    `  pm.test('${id} | persistence snapshot oracle',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}const rows=__fr16Rows(j);const after=rows.map(function(r){return r&&r.id!==undefined?'id:'+String(r.id):'name:'+String(r&&r.name);});const before=JSON.parse(pm.collectionVariables.get('${key}')||'[]');before.forEach(function(v){pm.expect(after).to.include(v);});pm.expect(${JSON.stringify(allowedGrowth)}).to.include(after.length-before.length);});`,
    '});'
  ];
}

function responseCharacterization(id) {
  return [
    `console.log('FR16 RESPONSE CHARACTERIZATION',JSON.stringify({id:'${id}',status:pm.response.code,contentType:pm.response.headers.get('Content-Type')||null,bodyLength:pm.response.text().length}));`,
    `pm.test('${id} | response is available for semantic review',function(){pm.expect(pm.response.code).to.be.a('number');});`
  ];
}

function reportConsistency(id, expectedPersisted) {
  return [
    "let __fr16Body={};try{__fr16Body=pm.response.json();}catch(e){}",
    "function __fr16FindNumber(o,re){if(!o||typeof o!=='object')return null;for(const k of Object.keys(o)){if(re.test(k)&&typeof o[k]==='number')return o[k];}return null;}",
    `const __fr16ReportedSuccess=__fr16FindNumber(__fr16Body,/(inserted|imported|success).*count|^(inserted|imported|success)$/i);`,
    `if(__fr16ReportedSuccess!==null){pm.test('${id} | exposed success counter does not contradict the persistence oracle',function(){pm.expect(__fr16ReportedSuccess).to.eql(${expectedPersisted});});}`,
    `pm.test('${id} | business report is not empty',function(){pm.expect(pm.response.text().trim().length).to.be.above(0);});`
  ];
}

function jsonItem({ id, source = 'AI', title, body, auth = 'admin', pre = [], tests = [], suffix = '', note = '', contentType = true, url = IMPORT_URL, method = 'POST' }) {
  const name = `[${source}] ${id}${suffix ? ` ${suffix}` : ''} — ${title}`;
  return {
    name,
    description: description(id, source, note),
    event: [
      ...(pre.length ? [script('prerequest', pre)] : []),
      script('test', [
        `pm.test('${id} | traceability and Source',function(){pm.expect(pm.info.requestName).to.include('${id}');pm.expect(pm.info.requestName).to.include('[${source}]');});`,
        `pm.test('${id} | required X-Student-Id header',function(){pm.expect(pm.request.headers.get('X-Student-Id')).to.eql('${STUDENT_ID}');});`,
        ...responseCharacterization(id),
        ...tests
      ])
    ],
    request: {
      method,
      header: requestHeaders(auth, contentType),
      ...(body === undefined ? {} : { body: { mode: 'raw', raw: body, options: { raw: { language: 'json' } } } }),
      url
    }
  };
}

function blockedItem(id, source, title, reason) {
  return {
    name: `[${source}] ${id} — ${title}`,
    description: description(id, source, reason, 'TECHNICALLY BLOCKED — no request is created'),
    item: []
  };
}

function validRow(name, price = 10, category = '{{categoryId}}', extras = '') {
  return `{"name":"${name}","price":${price},"description":"HW06 FR16","imageUrl":"","category_id":${category}${extras}}`;
}

function bodyRows(rows, topExtras = '') {
  return `{"products":[${rows.join(',')}]${topExtras}}`;
}

const folders = [];
function folder(name, items, note = '') { folders.push({ name, description: note, item: items }); }

const functional = [];
functional.push(jsonItem({
  id: 'AI-FR16-001', title: aiTitles['001'],
  pre: baselineScript('AI-FR16-001'),
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-001')}}}`)]),
  tests: [...reportConsistency('AI-FR16-001', 1), ...oracleScript('AI-FR16-001', { A: 'exactly-one' })],
  note: 'Canonical valid row; exactly one fresh marker must persist. Response counters are checked only when exposed.'
}));
functional.push(jsonItem({
  id: 'AI-FR16-002', title: aiTitles['002'],
  pre: baselineScript('AI-FR16-002', ['A', 'B', 'C']),
  body: bodyRows(['A', 'B', 'C'].map(s => validRow(`{{${markerKey('AI-FR16-002', s)}}}`))),
  tests: [...reportConsistency('AI-FR16-002', 3), ...oracleScript('AI-FR16-002', { A: 'exactly-one', B: 'exactly-one', C: 'exactly-one' })],
  note: 'All three fresh markers must persist together.'
}));
functional.push(jsonItem({
  id: 'AI-FR16-005', title: aiTitles['005'],
  pre: baselineScript('AI-FR16-005'),
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-005')}}}`)]),
  tests: oracleScript('AI-FR16-005', { A: 'exactly-one' }),
  note: 'The request-level and collection-level scripts both enforce the exact assignment header.'
}));
folder('AI — Functional (JSON API surface)', functional);

const domain = [];
const domainCases = [
  ['006', undefined, 'admin', {}],
  ['007', 'null', 'admin', {}],
  ['008', `[${validRow(`{{${markerKey('AI-FR16-008')}}}`)}]`, 'admin', { A: 'absent' }],
  ['009', '{}', 'admin', {}],
  ['010', '{"products":[]}', 'admin', {}],
  ['011', '{"products":null}', 'admin', {}],
  ['012', '{"products":{}}', 'admin', {}],
  ['013', bodyRows([validRow(`{{${markerKey('AI-FR16-013', 'A')}}}`), validRow('', 10), validRow(`{{${markerKey('AI-FR16-013', 'B')}}}`)]), 'admin', { A: 'absent', B: 'absent' }],
  ['014', bodyRows([validRow(`{{${markerKey('AI-FR16-014', 'A')}}}`), `{"price":10,"description":"missing name","imageUrl":"","category_id":{{categoryId}}}`]), 'admin', { A: 'absent' }],
  ['015', bodyRows([validRow(`{{${markerKey('AI-FR16-015', 'A')}}}`), `{"name":null,"price":10,"description":"null name","imageUrl":"","category_id":{{categoryId}}}`]), 'admin', { A: 'absent' }],
  ['016', bodyRows([validRow(`{{${markerKey('AI-FR16-016')}}}`, 10, '{{absentCategoryId}}')]), 'admin', { A: 'characterize' }],
  ['017', bodyRows([validRow('   ', 10)]), 'admin', {}]
];
for (const [num, body, auth, expectations] of domainCases) {
  const id = `AI-FR16-${num}`;
  const suffixes = Object.keys(expectations);
  const noEmbeddedMarker = ['006', '007', '009', '010', '011', '012', '017'].includes(num);
  const pre = noEmbeddedMarker ? snapshotBeforeScript(id) : suffixes.length ? baselineScript(id, suffixes) : setupMarkers(id);
  const tests = Object.keys(expectations).length
    ? oracleScript(id, Object.fromEntries(Object.entries(expectations).map(([k, v]) => [k, v === 'characterize' ? 'present-or-absent' : v])))
    : noEmbeddedMarker ? snapshotAfterScript(id, num === '017' ? [0, 1] : [0]) : [];
  if (['013', '014', '015'].includes(num)) tests.unshift(...reportConsistency(id, 0));
  if (num === '016') tests.push("console.log('AI-FR16-016 CHARACTERIZATION: acceptance/rejection is not a FR-16 defect by itself.');");
  if (num === '017') tests.push("console.log('AI-FR16-017 CHARACTERIZATION: trimming/acceptance remains unresolved; inspect response and stored name if accepted.');");
  domain.push(jsonItem({ id, title: aiTitles[num], body, auth, pre, tests, note: num === '016' || num === '017' ? 'Branching characterization: no exact status or acceptance rule is imposed.' : 'No exact rejection status/schema is asserted; mutation safety is checked where a marker exists.' }));
}
folder('AI — Domain (JSON API surface)', domain);

const boundary = [];
const boundarySpecs = [
  ['018', 1, 'exactly-one'],
  ['019', 0, 'absent'],
  ['020', -1, 'absent'],
  ['021', 1.5, 'exactly-one'],
  ['022', 1000000000000, 'present-or-absent']
];
for (const [num, price, mode] of boundarySpecs) {
  const id = `AI-FR16-${num}`;
  boundary.push(jsonItem({
    id, title: aiTitles[num], pre: baselineScript(id),
    body: bodyRows([validRow(`{{${markerKey(id)}}}`, price)]),
    tests: [...(['019', '020'].includes(num) ? reportConsistency(id, 0) : []), ...oracleScript(id, { A: mode })],
    note: mode === 'present-or-absent' ? 'Acceptance/rejection is characterization; either result must be persistence-consistent.' : `Contract-backed persistence expectation: ${mode}.`
  }));
}
boundary.push(jsonItem({
  id: 'AI-FR16-023', title: aiTitles['023'],
  pre: [
    ...setupMarkers('AI-FR16-023'),
    `const __prefix=pm.collectionVariables.get('${markerKey('AI-FR16-023')}');`,
    `pm.collectionVariables.set('${markerKey('AI-FR16-023')}',(__prefix+'_'+('N'.repeat(256))).slice(0,256));`,
    ...productExtract,
    `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${markerKey('AI-FR16-023')}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){pm.test('AI-FR16-023 | baseline long name absent',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}pm.expect(__fr16ExactCount(j,pm.collectionVariables.get('${markerKey('AI-FR16-023')}'))).to.eql(0);});});`
  ],
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-023')}}}`)]),
  tests: oracleScript('AI-FR16-023', { A: 'present-or-absent' }),
  note: 'Exact 256-character name; acceptance/rejection remains characterization because FR-15 inheritance is unresolved.'
}));
folder('AI — Boundary', boundary);

const state = [];
for (const [num, rows] of [
  ['024', [validRow('', 10), validRow(`{{${markerKey('AI-FR16-024', 'A')}}}`), validRow(`{{${markerKey('AI-FR16-024', 'B')}}}`)]],
  ['025', [validRow(`{{${markerKey('AI-FR16-025', 'A')}}}`), validRow(`{{${markerKey('AI-FR16-025', 'B')}}}`, 0), validRow(`{{${markerKey('AI-FR16-025', 'C')}}}`)]],
  ['026', [validRow(`{{${markerKey('AI-FR16-026', 'A')}}}`), validRow(`{{${markerKey('AI-FR16-026', 'B')}}}`), validRow(`{{${markerKey('AI-FR16-026', 'C')}}}`, -1)]],
  ['027', [validRow(`{{${markerKey('AI-FR16-027', 'A')}}}`), validRow('', 10), validRow(`{{${markerKey('AI-FR16-027', 'B')}}}`, 0)]]
]) {
  const id = `AI-FR16-${num}`;
  const suffixes = num === '025' || num === '026' ? ['A', 'B', 'C'] : ['A', 'B'];
  state.push(jsonItem({ id, title: aiTitles[num], pre: baselineScript(id, suffixes), body: bodyRows(rows), tests: [...reportConsistency(id, 0), ...oracleScript(id, Object.fromEntries(suffixes.map(s => [s, 'absent'])))], note: 'Hard FR-16 oracle: every marker from the invalid batch remains absent.' }));
}

state.push({ name: `[AI] AI-FR16-028 — ${aiTitles['028']}`, description: description('AI-FR16-028', 'AI', 'Two-request recovery sequence.'), item: [
  jsonItem({ id: 'AI-FR16-028', suffix: '[1/2]', title: 'invalid batch A rolls back', pre: baselineScript('AI-FR16-028', ['A', 'B']), body: bodyRows([validRow(`{{${markerKey('AI-FR16-028', 'A')}}}`), validRow(`{{${markerKey('AI-FR16-028', 'B')}}}`, 0)]), tests: oracleScript('AI-FR16-028', { A: 'absent', B: 'absent' }) }),
  jsonItem({ id: 'AI-FR16-028', suffix: '[2/2]', title: 'independent valid batch B succeeds', body: bodyRows([validRow(`{{${markerKey('AI-FR16-028', 'B')}}}`)]), tests: oracleScript('AI-FR16-028', { A: 'absent', B: 'exactly-one' }) })
] });
state.push({ name: `[AI] AI-FR16-029 — ${aiTitles['029']}`, description: description('AI-FR16-029', 'AI', 'Two-request transaction-isolation sequence.'), item: [
  jsonItem({ id: 'AI-FR16-029', suffix: '[1/2]', title: 'valid batch A persists', pre: baselineScript('AI-FR16-029', ['A', 'B']), body: bodyRows([validRow(`{{${markerKey('AI-FR16-029', 'A')}}}`)]), tests: oracleScript('AI-FR16-029', { A: 'exactly-one', B: 'absent' }) }),
  jsonItem({ id: 'AI-FR16-029', suffix: '[2/2]', title: 'invalid batch B rolls back without deleting A', body: bodyRows([validRow(`{{${markerKey('AI-FR16-029', 'B')}}}`), validRow('', 10)]), tests: oracleScript('AI-FR16-029', { A: 'present', B: 'absent' }) })
] });
state.push({ name: `[AI] AI-FR16-030 — ${aiTitles['030']}`, description: description('AI-FR16-030', 'AI', 'Two byte-identical sequential imports; duplicate policy remains characterization.'), item: [
  jsonItem({ id: 'AI-FR16-030', suffix: '[1/2]', title: 'first valid import', pre: baselineScript('AI-FR16-030'), body: bodyRows([validRow(`{{${markerKey('AI-FR16-030')}}}`)]), tests: oracleScript('AI-FR16-030', { A: 'present' }) }),
  jsonItem({ id: 'AI-FR16-030', suffix: '[2/2]', title: 'repeat exact body', body: bodyRows([validRow(`{{${markerKey('AI-FR16-030')}}}`)]), tests: oracleScript('AI-FR16-030', { A: 'present' }), note: 'Accept/reject/deduplicate/duplicate-insert are all characterization outcomes; at least the original complete row must remain.' })
] });
state.push({ name: `[AI] AI-FR16-031 — ${aiTitles['031']}`, description: description('AI-FR16-031', 'AI', 'Malformed request followed by valid recovery request.'), item: [
  jsonItem({ id: 'AI-FR16-031', suffix: '[1/2]', title: 'malformed JSON does not mutate', pre: baselineScript('AI-FR16-031', ['A', 'B']), body: `{"products":[{"name":"{{${markerKey('AI-FR16-031', 'A')}}}"`, tests: oracleScript('AI-FR16-031', { A: 'absent', B: 'absent' }) }),
  jsonItem({ id: 'AI-FR16-031', suffix: '[2/2]', title: 'canonical valid request still works', body: bodyRows([validRow(`{{${markerKey('AI-FR16-031', 'B')}}}`)]), tests: oracleScript('AI-FR16-031', { A: 'absent', B: 'exactly-one' }) })
] });
folder('AI — State / Sequence', state);

const security = [];
for (const [num, auth] of [['032', 'none'], ['033', 'malformed'], ['034', 'tampered'], ['035', 'nonAdmin'], ['036', 'forged']]) {
  const id = `AI-FR16-${num}`;
  const mappedAuth = auth === 'malformed' ? null : auth;
  const item = jsonItem({ id, title: aiTitles[num], pre: baselineScript(id), body: bodyRows([validRow(`{{${markerKey(id)}}}`)]), auth: mappedAuth, tests: oracleScript(id, { A: 'absent' }), note: 'Authentication/authorization is judged by zero persistence; exact rejection status/schema is not asserted.' });
  if (auth === 'malformed') item.request.header.splice(1, 0, { key: 'Authorization', value: 'Bearer not-a-jwt', type: 'text' });
  security.push(item);
}
security.push(jsonItem({
  id: 'AI-FR16-037', title: aiTitles['037'], auth: 'nonAdmin', pre: baselineScript('AI-FR16-037'),
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-037')}}}`, 10, '{{categoryId}}', ',"id":999,"role":"admin","isAdmin":true')], ',"role":"admin","isAdmin":true'),
  tests: oracleScript('AI-FR16-037', { A: 'absent' }), note: 'Body fields must not elevate a non-admin actor; persistence must remain zero.'
}));
security.push(jsonItem({
  id: 'AI-FR16-038', title: aiTitles['038'], pre: [
    ...setupMarkers('AI-FR16-038'),
    `pm.collectionVariables.set('${markerKey('AI-FR16-038')}',pm.collectionVariables.get('${markerKey('AI-FR16-038')}')+"_SQL_'_--");`,
    ...productExtract,
    `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${markerKey('AI-FR16-038')}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){pm.test('AI-FR16-038 | baseline SQL marker absent',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}pm.expect(__fr16ExactCount(j,pm.collectionVariables.get('${markerKey('AI-FR16-038')}'))).to.eql(0);});});`
  ],
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-038')}}}`)]), tests: oracleScript('AI-FR16-038', { A: 'present-or-absent' }),
  note: 'Acceptance is not required; the SQL-looking value must remain inert and persistence-consistent.'
}));
security.push(jsonItem({
  id: 'AI-FR16-039', title: aiTitles['039'], pre: baselineScript('AI-FR16-039'),
  body: bodyRows([`{"name":"{{${markerKey('AI-FR16-039')}}}","price":10,"description":"x'); SELECT 1; --","imageUrl":"","category_id":{{categoryId}}}`]), tests: oracleScript('AI-FR16-039', { A: 'present-or-absent' }),
  note: 'Acceptance is not required; no second statement or unrelated mutation may result.'
}));
security.push(jsonItem({
  id: 'AI-FR16-051', title: aiTitles['051'], pre: baselineScript('AI-FR16-051'),
  body: bodyRows([validRow(`{{${markerKey('AI-FR16-051')}}}`), 'null', '"x"', '{}']), tests: [...reportConsistency('AI-FR16-051', 0), ...oracleScript('AI-FR16-051', { A: 'absent' })],
  note: 'Hard atomicity oracle: type-confused invalid batch contributes zero rows.'
}));
security.push(jsonItem({
  id: 'AI-FR16-052', title: aiTitles['052'], pre: baselineScript('AI-FR16-052', ['A', 'B']),
  body: `{"products":[${validRow(`{{${markerKey('AI-FR16-052', 'A')}}}`)}],"products":[${validRow(`{{${markerKey('AI-FR16-052', 'B')}}}`)}]}`,
  tests: oracleScript('AI-FR16-052', { A: 'present-or-absent', B: 'present-or-absent' }),
  note: 'Raw duplicate keys are preserved. Key precedence is not asserted; persistence must reflect a complete parsed row and never bypass authorization/atomicity.'
}));
folder('AI — Security (JSON API surface)', security);

const schema = [];
for (const [num, auth, body, mode] of [
  ['042', 'admin', bodyRows([validRow(`{{${markerKey('AI-FR16-042')}}}`)]), 'exactly-one'],
  ['043', 'admin', bodyRows([validRow(`{{${markerKey('AI-FR16-043')}}}`), validRow('', 10)]), 'absent'],
  ['044', 'none', bodyRows([validRow(`{{${markerKey('AI-FR16-044')}}}`)]), 'absent'],
  ['045', 'nonAdmin', bodyRows([validRow(`{{${markerKey('AI-FR16-045')}}}`)]), 'absent']
]) {
  const id = `AI-FR16-${num}`;
  schema.push(jsonItem({ id, title: aiTitles[num], auth, pre: baselineScript(id), body, tests: [...(num === '043' ? reportConsistency(id, 0) : []), ...oracleScript(id, { A: mode })], note: 'Response status/content-type/body shape is logged only as runtime characterization; no exact schema is promoted.' }));
}
folder('AI — Schema / Characterization', schema);

const csvBlocked = ['003', '004', '040', '041', '047', '048', '049', '050'].map(num => blockedItem(
  `AI-FR16-${num}`, 'AI', aiTitles[num],
  'The approved case requires the real CSV workflow, but the supplied API specification documents only JSON products[] and defines no CSV upload endpoint, method details, multipart field, or frontend bridge callable from Postman. Step J may unblock only after the real workflow is identified.',
));
folder('AI — TECHNICALLY BLOCKED — real CSV workflow unavailable', csvBlocked, 'No CSV endpoint, method details, upload field, or bridge request is invented.');

folder('AI — BLOCKED — unsafe DB-error trigger', [blockedItem(
  'AI-FR16-046', 'AI', aiTitles['046'],
  'Human audit status is INCOMPLETE/BLOCKED. No safe deterministic DB-level failure trigger exists; the collection deliberately supplies no trigger body.',
)]);

const human = [];
human.push({
  name: `[HUMAN] HUM-FR16-001 — ${humanTitles['001']}`,
  description: description('HUM-FR16-001', 'HUMAN', 'Real concurrency: two pm.sendRequest imports are dispatched without awaiting either one; the primary request runs afterward as the persistence query. Duplicate policy permits a final exact-marker count of 1 or 2.'),
  event: [
    script('prerequest', [
      ...setupMarkers('HUM-FR16-001'),
      ...productExtract,
      `const __url=pm.variables.replaceIn('${IMPORT_URL}');`,
      `const __body=pm.variables.replaceIn('${bodyRows([validRow(`{{${markerKey('HUM-FR16-001')}}}`)])}');`,
      `pm.collectionVariables.set('humFr16ConcurrencyResponses','[]');`,
      "function __capture(label,err,res){const a=JSON.parse(pm.collectionVariables.get('humFr16ConcurrencyResponses')||'[]');a.push({label:label,error:err?String(err):null,status:res?res.code:null,body:res?res.text():null});pm.collectionVariables.set('humFr16ConcurrencyResponses',JSON.stringify(a));}",
      `const __req={url:__url,method:'POST',header:[{key:'Authorization',value:'Bearer '+pm.environment.get('adminToken')},{key:'Content-Type',value:'application/json'},{key:'X-Student-Id',value:'${STUDENT_ID}'}],body:{mode:'raw',raw:__body}};`,
      `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${markerKey('HUM-FR16-001')}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){`,
      `  pm.test('HUM-FR16-001 | baseline race marker is absent',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}pm.expect(__fr16ExactCount(j,pm.collectionVariables.get('${markerKey('HUM-FR16-001')}'))).to.eql(0);});`,
      "  if(!err){pm.sendRequest(__req,function(e,r){__capture('A',e,r);});pm.sendRequest(__req,function(e,r){__capture('B',e,r);});}",
      '});'
    ]),
    script('test', [
      `pm.test('HUM-FR16-001 | traceability and Source',function(){pm.expect(pm.info.requestName).to.include('HUM-FR16-001');pm.expect(pm.info.requestName).to.include('[HUMAN]');});`,
      `pm.test('HUM-FR16-001 | required X-Student-Id header',function(){pm.expect(pm.request.headers.get('X-Student-Id')).to.eql('${STUDENT_ID}');});`,
      ...productExtract,
      `let __j={};try{__j=pm.response.json();}catch(e){}const __n=__fr16ExactCount(__j,pm.collectionVariables.get('${markerKey('HUM-FR16-001')}'));`,
      `pm.test('HUM-FR16-001 | concurrent result contains complete rows only',function(){pm.expect([1,2]).to.include(__n);const rows=__fr16Rows(__j).filter(r=>r&&String(r.name)===String(pm.collectionVariables.get('${markerKey('HUM-FR16-001')}')));rows.forEach(r=>{pm.expect(r.name).to.be.a('string');pm.expect(Number(r.price)).to.be.above(0);});});`,
      "const __race=JSON.parse(pm.collectionVariables.get('humFr16ConcurrencyResponses')||'[]');",
      "pm.test('HUM-FR16-001 | both parallel calls completed',function(){pm.expect(__race).to.have.length(2);__race.forEach(function(r){pm.expect(r.error).to.equal(null);});});",
      "function __reportedSuccess(body){let j={};try{j=JSON.parse(body||'');}catch(e){return null;}for(const k of Object.keys(j)){if(/(inserted|imported|success).*count|^(inserted|imported|success)$/i.test(k)&&typeof j[k]==='number')return j[k];}return null;}",
      "const __reported=__race.map(function(r){return __reportedSuccess(r.body);});if(__reported.every(function(n){return n!==null;})){pm.test('HUM-FR16-001 | exposed counters agree with final persistence',function(){pm.expect(__reported[0]+__reported[1]).to.eql(__n);});}",
      "console.log('HUM-FR16-001 CONCURRENCY CHARACTERIZATION',pm.collectionVariables.get('humFr16ConcurrencyResponses'));"
    ])
  ],
  request: { method: 'GET', header: requestHeaders('none', false), url: `${PRODUCTS_URL}?search={{${markerKey('HUM-FR16-001')}}}` }
});

human.push({ name: `[HUMAN] HUM-FR16-003 — ${humanTitles['003']}`, description: description('HUM-FR16-003', 'HUMAN', 'Uses the documented category deletion endpoint and a dedicated disposable category ID.'), item: [
  jsonItem({ id: 'HUM-FR16-003', source: 'HUMAN', suffix: '[1/3]', title: 'import while category exists', pre: baselineScript('HUM-FR16-003'), body: bodyRows([validRow(`{{${markerKey('HUM-FR16-003')}}}`, 10, '{{humanStaleCategoryId}}')]), tests: oracleScript('HUM-FR16-003', { A: 'exactly-one' }) }),
  jsonItem({ id: 'HUM-FR16-003', source: 'HUMAN', suffix: '[2/3]', title: 'delete disposable category', method: 'DELETE', url: '{{baseUrl}}/api/categories/{{humanStaleCategoryId}}', body: undefined, contentType: false, tests: [
    ...oracleScript('HUM-FR16-003', { A: 'present' }),
    `pm.sendRequest({url:pm.variables.replaceIn('{{baseUrl}}/api/categories'),method:'GET',header:[{key:'Authorization',value:'Bearer '+pm.environment.get('adminToken')},{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){pm.test('HUM-FR16-003 | category list is readable after delete attempt',function(){pm.expect(err).to.equal(null);});let j=[];try{j=res.json();}catch(e){}const rows=Array.isArray(j)?j:(j&&Array.isArray(j.categories)?j.categories:(j&&Array.isArray(j.data)?j.data:[]));const absent=!rows.some(function(c){return c&&String(c.id)===String(pm.environment.get('humanStaleCategoryId'));});pm.collectionVariables.set('humFr16StaleCategoryReady',String(absent));console.log('HUM-FR16-003 CATEGORY DELETE CHARACTERIZATION',JSON.stringify({categoryAbsent:absent,status:pm.response.code}));});`
  ], note: 'Category CRUD is documented. The script records whether deletion actually establishes a stale reference; if not, Request 3 is skipped as a runtime precondition blocker rather than scored against an invented policy.' }),
  jsonItem({ id: 'HUM-FR16-003', source: 'HUMAN', suffix: '[3/3]', title: 'repeat exact import with stale category reference', body: bodyRows([validRow(`{{${markerKey('HUM-FR16-003')}}}`, 10, '{{humanStaleCategoryId}}')]), tests: [
    ...productExtract,
    `pm.sendRequest({url:pm.variables.replaceIn('${PRODUCTS_URL}?search='+encodeURIComponent(pm.collectionVariables.get('${markerKey('HUM-FR16-003')}'))),method:'GET',header:[{key:'X-Student-Id',value:'${STUDENT_ID}'}]},function(err,res){pm.test('HUM-FR16-003 | stale-reference branching persistence oracle',function(){pm.expect(err).to.equal(null);let j={};try{j=res.json();}catch(e){}pm.expect([1,2]).to.include(__fr16ExactCount(j,pm.collectionVariables.get('${markerKey('HUM-FR16-003')}')));});});`
  ], pre: ["if(pm.collectionVariables.get('humFr16StaleCategoryReady')!=='true'){console.warn('HUM-FR16-003 TECHNICALLY BLOCKED AT RUNTIME: category deletion did not establish a stale reference');pm.execution.skipRequest();}"], note: 'Accept/reject is characterization. Final exact-marker count is one (rejected) or two (accepted); the original complete product must remain.' })
] });

human.push(blockedItem('HUM-FR16-004', 'HUMAN', humanTitles['004'], 'No logout or token-revocation endpoint is documented in api_specification.md. The lifecycle operation is not invented.'));
human.push(blockedItem('HUM-FR16-005', 'HUMAN', humanTitles['005'], 'No user role-update or promotion endpoint is documented in api_specification.md. The privileged cross-endpoint operation is not invented.'));

human.push({ name: `[HUMAN] HUM-FR16-006 — ${humanTitles['006']}`, description: description('HUM-FR16-006', 'HUMAN', 'Five byte-identical invalid submissions execute sequentially; each request independently verifies zero persistence.'), item: Array.from({ length: 5 }, (_, i) => jsonItem({
  id: 'HUM-FR16-006', source: 'HUMAN', suffix: `[${i + 1}/5]`, title: `identical invalid batch attempt ${i + 1}`,
  pre: i === 0 ? baselineScript('HUM-FR16-006', ['A', 'B']) : [],
  body: bodyRows([validRow(`{{${markerKey('HUM-FR16-006', 'A')}}}`), validRow(`{{${markerKey('HUM-FR16-006', 'B')}}}`, 0)]),
  tests: oracleScript('HUM-FR16-006', { A: 'absent', B: 'absent' }),
  note: 'No rate-limit/lockout status is assumed; only per-request atomic rollback is mandatory.'
})) });
folder('HUMAN — Additional Coverage', human);

const collection = {
  info: {
    _postman_id: '23127194-fr16-import-products-collection',
    name: 'HW06 — FR-16 Import Products — 23127194',
    description: 'Step I implementation. Preserves 52 AI testcase IDs (51 VALID represented; AI-FR16-046 blocked) and 5 retained HUMAN testcase IDs. JSON cases use persistence/state oracles. CSV/cross-endpoint cases with no documented transport/API are technically blocked rather than invented. No official execution evidence is included.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
  },
  event: [
    script('prerequest', [
      `pm.request.headers.upsert({key:'X-Student-Id',value:'${STUDENT_ID}'});`,
      `pm.variables.set('studentId','${STUDENT_ID}');`,
      "pm.variables.set('fr16RequestStartedAt',Date.now());"
    ]),
    script('test', [
      "const __fr16Name=pm.info.requestName||'FR16 request';",
      `pm.test(__fr16Name+' | collection X-Student-Id',function(){pm.expect(pm.request.headers.get('X-Student-Id')).to.eql('${STUDENT_ID}');});`,
      "console.log('FR16 REQUEST CHARACTERIZATION',JSON.stringify({request:__fr16Name,status:pm.response.code,elapsedMs:pm.response.responseTime,contentType:pm.response.headers.get('Content-Type')||null}));"
    ])
  ],
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3000', type: 'string' },
    { key: 'studentId', value: STUDENT_ID, type: 'string' }
  ],
  item: folders
};

const environmentKeys = [
  ['baseUrl', 'http://localhost:3000'],
  ['studentId', STUDENT_ID],
  ['adminToken', ''],
  ['nonAdminToken', ''],
  ['tamperedJwt', ''],
  ['forgedAdminJwt', ''],
  ['staleToken', ''],
  ['superAdminToken', ''],
  ['categoryId', ''],
  ['absentCategoryId', '2147483647'],
  ['humanStaleCategoryId', ''],
  ['roleTargetUserId', '']
];

const environment = {
  id: '23127194-fr16-local-public',
  name: 'HW06 FR16 Local',
  values: environmentKeys.map(([key, value]) => ({ key, value, type: 'default', enabled: true })),
  _postman_variable_scope: 'environment',
  _postman_exported_at: '2026-08-21T00:00:00.000Z',
  _postman_exported_using: 'Step I static implementation — no official execution'
};

fs.mkdirSync(path.dirname(collectionPath), { recursive: true });
fs.mkdirSync(path.dirname(environmentPath), { recursive: true });
fs.writeFileSync(collectionPath, `${JSON.stringify(collection, null, 2)}\n`);
fs.writeFileSync(environmentPath, `${JSON.stringify(environment, null, 2)}\n`);

const allNodes = [];
const requestNodes = [];
const scripts = [];
function walk(nodes) {
  for (const node of nodes || []) {
    allNodes.push(node);
    if (node.request) requestNodes.push(node);
    for (const event of node.event || []) scripts.push(event.script.exec.join('\n'));
    walk(node.item);
  }
}
for (const event of collection.event || []) scripts.push(event.script.exec.join('\n'));
walk(collection.item);

for (const source of scripts) {
  new Function(source);
  if (source.includes('pm.sendRequest') && !source.includes('X-Student-Id')) throw new Error('Helper request lacks X-Student-Id');
}
for (const node of requestNodes) {
  const header = (node.request.header || []).find(h => h.key.toLowerCase() === 'x-student-id');
  if (!header || header.value !== '{{studentId}}') throw new Error(`Missing official student header: ${node.name}`);
}

const ids = new Set();
for (const node of allNodes) {
  const match = node.name.match(/(?:AI|HUM)-FR16-\d{3}/);
  if (match) ids.add(match[0]);
}
const expectedAi = Array.from({ length: 52 }, (_, i) => `AI-FR16-${String(i + 1).padStart(3, '0')}`);
const expectedHuman = ['HUM-FR16-001', 'HUM-FR16-003', 'HUM-FR16-004', 'HUM-FR16-005', 'HUM-FR16-006'];
for (const id of [...expectedAi, ...expectedHuman]) if (!ids.has(id)) throw new Error(`Missing testcase ID: ${id}`);
for (const id of [...expectedAi, ...expectedHuman]) {
  const source = id.startsWith('AI-') ? 'AI' : 'HUMAN';
  const represented = allNodes.some(node => node.name.includes(id) && String(node.description || '').includes(`Source = ${source}`));
  if (!represented) throw new Error(`Missing Source = ${source} traceability for ${id}`);
}

const blockedIds = allNodes
  .filter(node => String(node.description || '').includes('TECHNICALLY BLOCKED'))
  .map(node => node.name.match(/(?:AI|HUM)-FR16-\d{3}/)?.[0])
  .filter(Boolean);
const expectedBlocked = ['AI-FR16-003', 'AI-FR16-004', 'AI-FR16-040', 'AI-FR16-041', 'AI-FR16-046', 'AI-FR16-047', 'AI-FR16-048', 'AI-FR16-049', 'AI-FR16-050', 'HUM-FR16-004', 'HUM-FR16-005'];
if (JSON.stringify(blockedIds.sort()) !== JSON.stringify(expectedBlocked.sort())) throw new Error(`Blocked disposition mismatch: ${blockedIds.join(', ')}`);

for (const key of ['adminToken', 'nonAdminToken', 'tamperedJwt', 'forgedAdminJwt', 'staleToken', 'superAdminToken']) {
  const value = environment.values.find(v => v.key === key)?.value;
  if (value !== '') throw new Error(`Credential variable ${key} must remain blank`);
}

console.log(JSON.stringify({
  collectionPath,
  environmentPath,
  testcaseIds: ids.size,
  aiTestcaseIds: expectedAi.length,
  humanTestcaseIds: expectedHuman.length,
  executableAiTestcases: 43,
  executableHumanTestcases: 3,
  blockedTestcaseIds: blockedIds,
  requestItems: requestNodes.length,
  scriptsSyntaxChecked: scripts.length,
  officialRequestHeadersChecked: requestNodes.length
}, null, 2));
