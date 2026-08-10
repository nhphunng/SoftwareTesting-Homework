import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const credentials = new SharedArray('auth-credentials', () => requireColumns(
  parseCsv(open('../data/auth-credentials.csv')),
  ['email', 'password', 'expected_role', 'think_time_seconds'],
  'auth-credentials.csv',
));

export const options = {
  scenarios: {
    auth_heavy_stress: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.STRESS_RAMP || '30s', target: Number(__ENV.BASELINE_VUS || 50) },
        { duration: __ENV.STRESS_BASELINE_HOLD || '1m', target: Number(__ENV.BASELINE_VUS || 50) },
        { duration: __ENV.STRESS_RAMP || '30s', target: Number(__ENV.MEDIUM_VUS || 200) },
        { duration: __ENV.STRESS_STAGE_HOLD || '2m', target: Number(__ENV.MEDIUM_VUS || 200) },
        { duration: __ENV.STRESS_RAMP || '30s', target: Number(__ENV.HIGH_VUS || 600) },
        { duration: __ENV.STRESS_STAGE_HOLD || '2m', target: Number(__ENV.HIGH_VUS || 600) },
        { duration: __ENV.STRESS_RAMP || '30s', target: Number(__ENV.BREAK_VUS || 1200) },
        { duration: __ENV.STRESS_STAGE_HOLD || '2m', target: Number(__ENV.BREAK_VUS || 1200) },
        { duration: __ENV.STRESS_RAMP_DOWN || '30s', target: 0 },
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
  const loginResponse = http.post(`${BASE_URL}/api/login`, JSON.stringify({
    email: user.email,
    password: user.password,
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'login', endpoint_group: 'auth-heavy' },
  });

  const loginOk = check(loginResponse, {
    'login returns 200': (res) => res.status === 200,
    'login returns JWT': (res) => Boolean(res.json('token')),
    'login returns expected role': (res) => res.json('user.role') === user.expected_role,
  });

  if (!loginOk) return;

  const authenticatedPath = user.expected_role === 'admin' ? '/api/coupons' : '/api/users/me';
  const surfaceResponse = http.get(`${BASE_URL}${authenticatedPath}`, {
    headers: { Authorization: `Bearer ${loginResponse.json('token')}` },
    tags: {
      endpoint: user.expected_role === 'admin' ? 'admin-coupon-list' : 'user-profile',
      endpoint_group: 'auth-heavy',
    },
  });

  check(surfaceResponse, {
    'authenticated surface returns 200': (res) => res.status === 200,
    'authenticated surface matches role': (res) => {
      if (user.expected_role === 'admin') return Array.isArray(res.json());
      return res.json('email') === user.email;
    },
  });
  sleep(Number(user.think_time_seconds));
}
