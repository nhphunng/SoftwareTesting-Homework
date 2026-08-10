import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const products = new SharedArray('endurance-products', () => requireColumns(
  parseCsv(open('../data/read-products.csv')),
  ['search_keyword'],
  'read-products.csv',
));

export const options = {
  scenarios: {
    calibrated_soak: {
      executor: 'constant-arrival-rate',
      rate: Number(__ENV.STABLE_RPS || 4000),
      timeUnit: '1s',
      duration: __ENV.SOAK_DURATION || '12m',
      preAllocatedVUs: Number(__ENV.PREALLOCATED_VUS || 300),
      maxVUs: Number(__ENV.MAX_VUS || 1000),
      tags: { scenario_type: 'endurance', endpoint_group: 'read-heavy' },
    },
  },
  thresholds: {
    'http_req_failed{scenario_type:endurance}': ['rate<0.01'],
    'http_req_duration{scenario_type:endurance}': ['p(95)<500'],
    dropped_iterations: ['count==0'],
    checks: ['rate>0.99'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  const item = products[exec.scenario.iterationInTest % products.length];
  const response = http.get(`${BASE_URL}/api/products?search=${encodeURIComponent(item.search_keyword)}`, {
    tags: {
      scenario_type: 'endurance',
      endpoint: 'product-search',
      endpoint_group: 'read-heavy',
    },
  });
  check(response, {
    'endurance product search returns 200': (res) => res.status === 200,
    'endurance product search returns a result': (res) => Array.isArray(res.json()) && res.json().length > 0,
  });
}
