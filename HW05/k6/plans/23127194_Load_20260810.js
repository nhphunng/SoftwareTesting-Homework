import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const products = new SharedArray('read-products', () => requireColumns(
  parseCsv(open('../data/read-products.csv')),
  ['search_keyword', 'minimum_matches', 'think_time_seconds'],
  'read-products.csv',
));

export const options = {
  scenarios: {
    read_heavy_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.RAMP_UP || '1m', target: Number(__ENV.TARGET_VUS || 50) },
        { duration: __ENV.HOLD || '5m', target: Number(__ENV.TARGET_VUS || 50) },
        { duration: __ENV.RAMP_DOWN || '1m', target: 0 },
      ],
      tags: { scenario_type: 'load', endpoint_group: 'read-heavy' },
    },
  },
  thresholds: {
    'http_req_failed{endpoint_group:read-heavy}': ['rate<0.01'],
    'http_req_duration{endpoint_group:read-heavy}': ['p(95)<500'],
    checks: ['rate>0.99'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  const item = products[exec.scenario.iterationInTest % products.length];
  const encodedKeyword = encodeURIComponent(item.search_keyword);
  const response = http.get(`${BASE_URL}/api/products?search=${encodedKeyword}`, {
    tags: { endpoint: 'product-search', endpoint_group: 'read-heavy' },
  });

  check(response, {
    'product search returns 200': (res) => res.status === 200,
    'product search returns enough matches': (res) => {
      const body = res.json();
      return Array.isArray(body) && body.length >= Number(item.minimum_matches);
    },
    'product names contain the keyword': (res) => {
      const body = res.json();
      const keyword = item.search_keyword.toLowerCase();
      return Array.isArray(body) && body.every((product) => String(product.name).toLowerCase().includes(keyword));
    },
  });
  sleep(Number(item.think_time_seconds));
}
