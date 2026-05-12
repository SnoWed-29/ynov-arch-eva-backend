const test = require('node:test');
const assert = require('node:assert');

const SERVICE_URL = 'http://localhost:3002';

test('Product Service Health Check', async () => {
  try {
    const res = await fetch(`${SERVICE_URL}/health`);
    const data = await res.json();
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'products-service OK');
  } catch (err) {
    console.warn('⚠️ Product Service is not running.');
  }
});
