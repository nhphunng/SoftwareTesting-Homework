import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';
import { SharedArray } from 'k6/data';
import { parseCsv, requireColumns } from '../lib/csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:3000';
const orders = new SharedArray('transaction-orders', () => requireColumns(
  parseCsv(open('../data/transaction-orders.csv')),
  ['email', 'password', 'coupon_code', 'total_amount', 'shipping_address', 'think_time_seconds'],
  'transaction-orders.csv',
));

export const options = {
  scenarios: {
    transactional_spike: {
      executor: 'ramping-vus',
      stages: [
        { duration: __ENV.SPIKE_BASELINE_RAMP || '30s', target: Number(__ENV.BASELINE_VUS || 20) },
        { duration: __ENV.SPIKE_BASELINE_HOLD || '1m', target: Number(__ENV.BASELINE_VUS || 20) },
        { duration: __ENV.SPIKE_RAMP || '10s', target: Number(__ENV.SPIKE_VUS || 400) },
        { duration: __ENV.SPIKE_HOLD || '1m', target: Number(__ENV.SPIKE_VUS || 400) },
        { duration: __ENV.SPIKE_RECOVERY_RAMP || '10s', target: Number(__ENV.BASELINE_VUS || 20) },
        { duration: __ENV.RECOVERY_HOLD || '2m', target: Number(__ENV.BASELINE_VUS || 20) },
        { duration: __ENV.SPIKE_RAMP_DOWN || '20s', target: 0 },
      ],
      tags: { scenario_type: 'spike', endpoint_group: 'transactional' },
    },
  },
  thresholds: {
    'http_req_failed{endpoint_group:transactional}': ['rate<0.01'],
    'http_req_duration{endpoint_group:transactional}': ['p(95)<1500'],
    checks: ['rate>0.99'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

export function setup() {
  return orders.map((order) => {
    const response = http.post(`${BASE_URL}/api/login`, JSON.stringify({
      email: order.email,
      password: order.password,
    }), {
      headers: { 'Content-Type': 'application/json' },
      tags: { traffic: 'setup', endpoint: 'login' },
    });
    if (response.status !== 200 || !response.json('token')) {
      throw new Error(`Cannot authenticate transactional user ${order.email}`);
    }
    return { ...order, token: response.json('token') };
  });
}

export default function (preparedOrders) {
  const order = preparedOrders[exec.vu.idInTest % preparedOrders.length];
  const couponResponse = http.post(`${BASE_URL}/api/apply-coupon`, JSON.stringify({
    code: order.coupon_code,
    total_amount: Number(order.total_amount),
  }), {
    headers: { 'Content-Type': 'application/json' },
    tags: { endpoint: 'apply-coupon', endpoint_group: 'transactional' },
  });

  const couponOk = check(couponResponse, {
    'coupon application returns 200': (res) => res.status === 200,
    'fixed coupon produces a positive final amount': (res) => Number(res.json('final_amount')) > 0,
  });

  if (!couponOk) return;

  const response = http.post(`${BASE_URL}/api/checkout`, JSON.stringify({
    total_amount: Number(couponResponse.json('final_amount')),
    shipping_address: `${order.shipping_address} - ${exec.scenario.iterationInTest}`,
  }), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${order.token}`,
    },
    tags: { endpoint: 'checkout', endpoint_group: 'transactional' },
  });

  check(response, {
    'checkout returns 200': (res) => res.status === 200,
    'checkout returns order id': (res) => Boolean(res.json('orderId')),
  });
  sleep(Number(order.think_time_seconds));
}
