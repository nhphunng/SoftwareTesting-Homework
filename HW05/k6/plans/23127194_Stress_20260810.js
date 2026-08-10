import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const credentials = new SharedArray('auth-credentials', () => requireColumns(
  parseCsv(open('../data/auth-credentials.csv')),
  ['email', 'password', 'think_time_seconds'],
  'auth-credentials.csv',
));

export const options = {
  scenarios: {
    auth_heavy_stress: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: Number(__ENV.BASELINE_VUS || 5) },
        { duration: '1m', target: Number(__ENV.BASELINE_VUS || 5) },
        { duration: '30s', target: Number(__ENV.MEDIUM_VUS || 20) },
        { duration: '2m', target: Number(__ENV.MEDIUM_VUS || 20) },
        { duration: '30s', target: Number(__ENV.HIGH_VUS || 50) },
        { duration: '2m', target: Number(__ENV.HIGH_VUS || 50) },
        { duration: '30s', target: Number(__ENV.BREAK_VUS || 100) },
        { duration: '2m', target: Number(__ENV.BREAK_VUS || 100) },
        { duration: '30s', target: 0 },
      ],
      tags: { scenario_type: 'stress', endpoint_group: 'auth-heavy' },
    },
  },
  thresholds: {
    'http_req_failed{endpoint_group:auth-heavy}': ['rate<0.01'],
    'http_req_duration{endpoint_group:auth-heavy}': ['p(95)<700'],
    checks: ['rate>0.99'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export default function () {
  const user = credentials[exec.vu.idInTest % credentials.length];
  const response = http.post(`${BASE_URL}/api/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'login', endpoint_group: 'auth-heavy' },
  });

  check(response, {
    'login returns 200': (res) => res.status === 200,
    'login returns JWT': (res) => Boolean(res.json('token')),
  });
  sleep(Number(user.think_time_seconds));
}
