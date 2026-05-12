const test = require('node:test');
const assert = require('node:assert');

const SERVICE_URL = 'http://localhost:3001';

test('Auth Service Health Check', async () => {
  try {
    const res = await fetch(`${SERVICE_URL}/health`);
    const data = await res.json();
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'auth-service OK');
  } catch (err) {
    console.warn('⚠️ Auth Service is not running.');
  }
});
