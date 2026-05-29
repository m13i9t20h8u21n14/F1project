const http = require('http');
const https = require('https');

const targetUrl = process.env.TARGET_URL || 'http://localhost:5000';
console.log(`🚀 Starting CI/CD Smoke Test targeting: ${targetUrl}/health`);

const client = targetUrl.startsWith('https') ? https : http;

const req = client.get(`${targetUrl}/health`, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`HTTP Status Code: ${res.statusCode}`);
    console.log(`Response Body: ${data}`);

    if (res.statusCode !== 200) {
      console.error(`❌ Smoke Test Failed: Expected HTTP status 200, got ${res.statusCode}`);
      process.exit(1);
    }

    try {
      const parsed = JSON.parse(data);
      if (parsed.success === true && parsed.status === 'UP') {
        console.log('✅ Smoke Test Passed: Server reports UP status and connection is healthy!');
        process.exit(0);
      } else {
        console.error('❌ Smoke Test Failed: Response data did not contain correct health structures.');
        process.exit(1);
      }
    } catch (err) {
      console.error('❌ Smoke Test Failed: Response was not valid JSON.');
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error(`❌ Smoke Test Failed: Connection error occurred: ${err.message}`);
  process.exit(1);
});

// Set timeout to prevent hanging forever
req.setTimeout(15000, () => {
  console.error('❌ Smoke Test Failed: Request timed out after 15 seconds.');
  req.destroy();
  process.exit(1);
});
