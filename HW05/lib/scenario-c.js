import http from 'k6/http';
import exec from 'k6/execution';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { parseCsv } from './csv.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const DATA_FILE = __ENV.DATA_FILE || '../data/scenario-c.example.csv';
const rows = new SharedArray('scenario-c-data', () => parseCsv(open(DATA_FILE)));

const flowSuccess = new Rate('scenario_c_flow_success');
const businessErrors = new Rate('scenario_c_business_errors');
const checkoutDuration = new Trend('scenario_c_checkout_duration', true);
const cancellationDuration = new Trend('scenario_c_cancellation_duration', true);

const requiredColumns = [
  'email',
  'password',
  'search_keyword',
  'product_id',
  'quantity',
  'shipping_address',
];

function safeJson(response, path) {
  if (!response || !response.body) return undefined;
  try {
    return path ? response.json(path) : response.json();
  } catch (_) {
    return undefined;
  }
}

function jsonHeaders(token) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function requestParams(step, endpointGroup, token) {
  return {
    headers: jsonHeaders(token),
    tags: { step, endpoint_group: endpointGroup, flow: 'scenario_c' },
  };
}

function jsonPost(path, body, step, endpointGroup, token) {
  return http.post(
    `${BASE_URL}${path}`,
    JSON.stringify(body),
    requestParams(step, endpointGroup, token),
  );
}

function stopIteration() {
  flowSuccess.add(false);
  return false;
}

function validateRuntimeConfiguration() {
  if (__ENV.SKELETON_VALIDATE === 'true') return;
  if (__ENV.WORKLOAD_CONFIRMED !== 'true') {
    throw new Error('Refusing to run: set WORKLOAD_CONFIRMED=true only after human review.');
  }
  if (!__ENV.DATA_FILE || __ENV.DATA_FILE.includes('.example.')) {
    throw new Error('Refusing to run with example data. Set DATA_FILE to a reviewed local CSV.');
  }

  const requiredRows = Number(__ENV.REQUIRED_USER_ROWS);
  if (!Number.isInteger(requiredRows) || requiredRows <= 0) {
    throw new Error('REQUIRED_USER_ROWS must be a reviewed positive integer.');
  }
  if (rows.length < requiredRows) {
    throw new Error(`CSV has ${rows.length} rows but the reviewed workload requires ${requiredRows}.`);
  }

  const configuredConcurrency = [
    'LOAD_VUS',
    'STRESS_BASELINE_VUS',
    'STRESS_LEVEL_1_VUS',
    'STRESS_LEVEL_2_VUS',
    'SPIKE_BASELINE_VUS',
    'SPIKE_VUS',
    'SPIKE_RECOVERY_VUS',
    'ENDURANCE_VUS',
  ]
    .map((name) => Number(__ENV[name]))
    .filter((value) => Number.isInteger(value) && value > 0);
  const maximumConfiguredVus = Math.max(0, ...configuredConcurrency);
  if (requiredRows < maximumConfiguredVus) {
    throw new Error(
      `REQUIRED_USER_ROWS (${requiredRows}) is below the configured maximum VUs (${maximumConfiguredVus}).`,
    );
  }

  const thinkTime = Number(__ENV.THINK_TIME_SECONDS);
  if (!Number.isFinite(thinkTime) || thinkTime < 0) {
    throw new Error('THINK_TIME_SECONDS must be a reviewed non-negative number.');
  }
}

function validateRows() {
  const seenEmails = new Set();
  rows.forEach((row, index) => {
    requiredColumns.forEach((column) => {
      if (!row[column]) throw new Error(`CSV row ${index + 2} is missing ${column}.`);
    });
    if (Object.values(row).some((value) => /REPLACE_|example\.invalid/.test(value))) {
      throw new Error(`CSV row ${index + 2} still contains placeholder data.`);
    }
    if (seenEmails.has(row.email)) throw new Error(`Duplicate CSV email: ${row.email}`);
    seenEmails.add(row.email);

    const quantity = Number(row.quantity);
    const productId = Number(row.product_id);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error(`CSV row ${index + 2} has an invalid quantity.`);
    }
    if (!Number.isInteger(productId) || productId <= 0) {
      throw new Error(`CSV row ${index + 2} has an invalid product_id.`);
    }
  });
}

export function setupScenarioC() {
  validateRuntimeConfiguration();
  if (__ENV.SKELETON_VALIDATE === 'true') return { validated: true };
  validateRows();

  const productIds = [...new Set(rows.map((row) => row.product_id))];
  productIds.forEach((productId) => {
    const response = http.get(
      `${BASE_URL}/api/products/${productId}`,
      requestParams('setup_product_check', 'setup', ''),
    );
    const product = safeJson(response);
    if (response.status !== 200 || !product || !product.id) {
      throw new Error(`Setup failed: product ${productId} is unavailable.`);
    }
  });

  return { validated: true, dataRows: rows.length };
}

export function executeScenarioC() {
  const row = rows[(exec.vu.idInTest - 1) % rows.length];
  const thinkTime = Number(__ENV.THINK_TIME_SECONDS || 0);
  let token;
  let product;
  let orderId;
  let cartReady = false;
  let orderCanceled = false;

  group('01 auth-heavy - login', () => {
    const response = jsonPost(
      '/api/login',
      { email: row.email, password: row.password },
      'login',
      'auth-heavy',
      '',
    );
    const ok = check(response, {
      'login returns HTTP 200': (result) => result.status === 200,
      'login returns a JWT token': (result) => Boolean(safeJson(result, 'token')),
    });
    businessErrors.add(!ok);
    if (ok) token = safeJson(response, 'token');
  });
  if (!token) return stopIteration();
  sleep(thinkTime);

  group('02 read-heavy - search and product detail', () => {
    const searchResponse = http.get(
      `${BASE_URL}/api/products?search=${encodeURIComponent(row.search_keyword)}`,
      requestParams('search_products', 'read-heavy', token),
    );
    const searchOk = check(searchResponse, {
      'search returns HTTP 200': (result) => result.status === 200,
      'search returns an array': (result) => Array.isArray(safeJson(result)),
    });
    businessErrors.add(!searchOk);
    if (!searchOk) return;

    const detailResponse = http.get(
      `${BASE_URL}/api/products/${row.product_id}`,
      requestParams('product_detail', 'read-heavy', token),
    );
    const detail = safeJson(detailResponse);
    const detailOk = check(detailResponse, {
      'product detail returns HTTP 200': (result) => result.status === 200,
      'product detail matches CSV product': () => Number(detail?.id) === Number(row.product_id),
      'product detail has a positive numeric price': () => Number(detail?.price) > 0,
    });
    businessErrors.add(!detailOk);
    if (detailOk) product = detail;
  });
  if (!product) return stopIteration();
  sleep(thinkTime);

  group('03 transactional - add and verify cart', () => {
    const quantity = Number(row.quantity);
    const addResponse = jsonPost(
      '/api/cart',
      { id: product.id, name: product.name, price: Number(product.price), quantity },
      'add_to_cart',
      'transactional',
      token,
    );
    const addOk = check(addResponse, {
      'add to cart returns HTTP 200': (result) => result.status === 200,
    });
    businessErrors.add(!addOk);
    if (!addOk) return;

    const cartResponse = http.get(
      `${BASE_URL}/api/cart`,
      requestParams('get_cart', 'transactional', token),
    );
    const cart = safeJson(cartResponse);
    const cartOk = check(cartResponse, {
      'cart returns HTTP 200': (result) => result.status === 200,
      'cart contains selected product': () => Array.isArray(cart)
        && cart.some((item) => Number(item.id) === Number(product.id)),
    });
    businessErrors.add(!cartOk);
    cartReady = cartOk;
  });
  if (!cartReady) return stopIteration();
  sleep(thinkTime);

  group('04 transactional - checkout', () => {
    const totalAmount = Number(product.price) * Number(row.quantity);
    const response = jsonPost(
      '/api/checkout',
      { total_amount: totalAmount, shipping_address: row.shipping_address },
      'checkout',
      'transactional',
      token,
    );
    checkoutDuration.add(response.timings.duration);
    const ok = check(response, {
      'checkout returns HTTP 200': (result) => result.status === 200,
      'checkout returns orderId': (result) => Number(safeJson(result, 'orderId')) > 0,
    });
    businessErrors.add(!ok);
    if (ok) orderId = Number(safeJson(response, 'orderId'));
  });
  if (!orderId) return stopIteration();
  sleep(thinkTime);

  group('05 transactional - read and cancel fresh order', () => {
    const detailResponse = http.get(
      `${BASE_URL}/api/orders/${orderId}`,
      requestParams('order_detail', 'transactional', token),
    );
    const order = safeJson(detailResponse);
    const detailOk = check(detailResponse, {
      'order detail returns HTTP 200': (result) => result.status === 200,
      'order detail matches checkout orderId': () => Number(order?.id) === orderId,
      'new order is pending': () => order?.status === 'pending',
    });
    businessErrors.add(!detailOk);
    if (!detailOk) return;

    const cancelResponse = http.put(
      `${BASE_URL}/api/orders/${orderId}/cancel`,
      null,
      requestParams('cancel_order', 'transactional', token),
    );
    cancellationDuration.add(cancelResponse.timings.duration);
    const cancelOk = check(cancelResponse, {
      'cancel returns HTTP 200': (result) => result.status === 200,
    });
    businessErrors.add(!cancelOk);
    orderCanceled = cancelOk;
  });
  if (!orderCanceled) return stopIteration();
  sleep(thinkTime);

  let finalVerified = false;
  group('06 transactional - verify canceled history', () => {
    const response = http.get(
      `${BASE_URL}/api/orders/my-orders`,
      requestParams('my_orders', 'transactional', token),
    );
    const orders = safeJson(response);
    const ok = check(response, {
      'my orders returns HTTP 200': (result) => result.status === 200,
      'my orders returns an array': () => Array.isArray(orders),
      'fresh order is canceled': () => Array.isArray(orders)
        && orders.some((order) => Number(order.id) === orderId && order.status === 'canceled'),
    });
    businessErrors.add(!ok);
    finalVerified = ok;
  });

  flowSuccess.add(finalVerified);
  return finalVerified;
}
