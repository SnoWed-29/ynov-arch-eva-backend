const { spawn } = require('node:child_process');
const path = require('node:path');

const services = [
  'api-gateway',
  'auth-service',
  'product-service',
  'order-service',
  'payment-service',
  'notification-service'
];

async function runTests() {
  console.log('🧪 Running Backend Health Check Tests...\n');
  
  for (const service of services) {
    const testPath = path.join(service, 'tests', 'basic.test.js');
    console.log(`[${service}] Running basic.test.js...`);
    
    await new Promise((resolve) => {
      const child = spawn('node', ['--test', testPath], { stdio: 'inherit' });
      child.on('exit', resolve);
    });
    console.log('');
  }
}

runTests();
