import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const products = new SharedArray('read-products', () => requireColumns(
  parseCsv(open('../data/read-products.csv')),
  ['product_id', 'think_time_seconds'],
  'read-products.csv',
));

export const options = {
  scenarios: {
    read_heavy_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.RAMP_UP || '1m', target: Number(__ENV.TARGET_VUS || 20) },
        { duration: __ENV.HOLD || '5m', target: Number(__ENV.TARGET_VUS || 20) },
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
  const response = http.get(`${BASE_URL}/api/products/${item.product_id}`, {
    tags: { endpoint: 'product-detail', endpoint_group: 'read-heavy' },
  });

  check(response, {
    'product detail returns 200': (res) => res.status === 200,
    'product id matches input': (res) => Number(res.json('id')) === Number(item.product_id),
  });
  sleep(Number(item.think_time_seconds));
}
