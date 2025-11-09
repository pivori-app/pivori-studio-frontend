/**
 * Load Testing Script - k6
 * Comprehensive load testing for Pivori Studio
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter, Gauge } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const duration = new Trend('duration');
const successCount = new Counter('success');
const activeUsers = new Gauge('active_users');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const DURATION = __ENV.DURATION || '5m';
const VUS = __ENV.VUS || 100;
const RAMP_UP = __ENV.RAMP_UP || '30s';

export const options = {
  stages: [
    { duration: RAMP_UP, target: VUS },
    { duration: DURATION, target: VUS },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'],
    'http_req_failed': ['rate<0.1'],
    'errors': ['rate<0.1'],
  },
};

export default function () {
  activeUsers.add(1);

  // Test 1: Health Check
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'health check status is 200': (r) => r.status === 200,
      'health check response time < 100ms': (r) => r.timings.duration < 100,
    });
    duration.add(res.timings.duration, { endpoint: 'health' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 2: List Services
  group('List Services', () => {
    const res = http.get(`${BASE_URL}/api/services`);
    check(res, {
      'list services status is 200': (r) => r.status === 200,
      'list services response time < 500ms': (r) => r.timings.duration < 500,
      'list services returns array': (r) => Array.isArray(JSON.parse(r.body)),
    });
    duration.add(res.timings.duration, { endpoint: 'list_services' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 3: Get Service Details
  group('Get Service Details', () => {
    const res = http.get(`${BASE_URL}/api/services/geolocation`);
    check(res, {
      'get service status is 200': (r) => r.status === 200,
      'get service response time < 300ms': (r) => r.timings.duration < 300,
      'get service returns object': (r) => typeof JSON.parse(r.body) === 'object',
    });
    duration.add(res.timings.duration, { endpoint: 'get_service' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 4: Get Metrics
  group('Get Metrics', () => {
    const res = http.get(`${BASE_URL}/api/metrics`);
    check(res, {
      'get metrics status is 200': (r) => r.status === 200,
      'get metrics response time < 500ms': (r) => r.timings.duration < 500,
    });
    duration.add(res.timings.duration, { endpoint: 'get_metrics' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 5: Create Geolocation Record
  group('Create Geolocation', () => {
    const payload = JSON.stringify({
      user_id: `user_${Math.random()}`,
      latitude: 48.8566,
      longitude: 2.3522,
      accuracy: 10.5,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${__ENV.API_TOKEN || 'test-token'}`,
      },
    };

    const res = http.post(`${BASE_URL}/api/geolocation/locate`, payload, params);
    check(res, {
      'create geolocation status is 201': (r) => r.status === 201,
      'create geolocation response time < 500ms': (r) => r.timings.duration < 500,
    });
    duration.add(res.timings.duration, { endpoint: 'create_geolocation' });
    errorRate.add(res.status !== 201);
    if (res.status === 201) successCount.add(1);
  });

  sleep(1);

  // Test 6: List Geolocation Records
  group('List Geolocation', () => {
    const res = http.get(`${BASE_URL}/api/geolocation/records`);
    check(res, {
      'list geolocation status is 200': (r) => r.status === 200,
      'list geolocation response time < 500ms': (r) => r.timings.duration < 500,
    });
    duration.add(res.timings.duration, { endpoint: 'list_geolocation' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 7: Get Routing
  group('Get Routing', () => {
    const payload = JSON.stringify({
      origin: { lat: 48.8566, lng: 2.3522 },
      destination: { lat: 48.8606, lng: 2.2944 },
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.post(`${BASE_URL}/api/routing/calculate`, payload, params);
    check(res, {
      'routing status is 200': (r) => r.status === 200,
      'routing response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    duration.add(res.timings.duration, { endpoint: 'routing' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 8: Get Market Data
  group('Get Market Data', () => {
    const res = http.get(`${BASE_URL}/api/market-data/latest?symbol=BTC/USD`);
    check(res, {
      'market data status is 200': (r) => r.status === 200,
      'market data response time < 500ms': (r) => r.timings.duration < 500,
    });
    duration.add(res.timings.duration, { endpoint: 'market_data' });
    errorRate.add(res.status !== 200);
    if (res.status === 200) successCount.add(1);
  });

  sleep(1);

  // Test 9: Concurrent Requests
  group('Concurrent Requests', () => {
    const requests = {
      'services': {
        method: 'GET',
        url: `${BASE_URL}/api/services`,
      },
      'metrics': {
        method: 'GET',
        url: `${BASE_URL}/api/metrics`,
      },
      'health': {
        method: 'GET',
        url: `${BASE_URL}/health`,
      },
    };

    const responses = http.batch(requests);
    check(responses, {
      'concurrent requests all successful': (r) => {
        return Object.values(r).every(res => res.status === 200);
      },
    });

    Object.entries(responses).forEach(([name, res]) => {
      duration.add(res.timings.duration, { endpoint: `concurrent_${name}` });
      errorRate.add(res.status !== 200);
      if (res.status === 200) successCount.add(1);
    });
  });

  sleep(1);

  activeUsers.add(-1);
}

/**
 * Setup function - runs once before all VUs
 */
export function setup() {
  console.log('Starting load test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`VUs: ${VUS}`);
  console.log(`Duration: ${DURATION}`);
  console.log(`Ramp-up: ${RAMP_UP}`);
}

/**
 * Teardown function - runs once after all VUs
 */
export function teardown(data) {
  console.log('Load test completed');
}

/**
 * Handle summary
 */
export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'summary.json': JSON.stringify(data),
  };
}

/**
 * Text summary helper
 */
function textSummary(data, options) {
  let summary = '\n=== Load Test Summary ===\n';
  
  if (data.metrics) {
    Object.entries(data.metrics).forEach(([name, metric]) => {
      if (metric.values) {
        summary += `${name}: ${JSON.stringify(metric.values)}\n`;
      }
    });
  }

  return summary;
}

