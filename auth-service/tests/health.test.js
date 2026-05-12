const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const app = require('../src/app');

test('Auth Service Health Check', async (t) => {
  const server = http.createServer(app);
  
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();

  await t.test('GET /health returns 200 and OK status', async () => {
    const res = await fetch(`http://localhost:${port}/health`);
    const data = await res.json();
    
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'auth-service OK');
  });

  server.close();
});
