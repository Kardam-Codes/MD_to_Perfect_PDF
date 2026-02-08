// Simple test runner for PDF server
import assert from 'assert';
import http from 'http';

// Test configuration
const SERVER_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'chrome-extension://test'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsedBody = res.headers['content-type']?.includes('application/json') 
            ? JSON.parse(body) 
            : body;
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            body: parsedBody 
          });
        } catch (e) {
          resolve({ 
            statusCode: res.statusCode, 
            headers: res.headers, 
            body: body 
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test cases
async function runTests() {
  console.log('🧪 Running PDF Server Tests...\n');

  let testsPassed = 0;
  let testsTotal = 0;

  function test(name, fn) {
    testsTotal++;
    try {
      fn();
      console.log(`✅ ${name}`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  // Test 1: Health check endpoint
  try {
    const healthResponse = await makeRequest('/');
    test('GET / - Health check', () => {
      assert.strictEqual(healthResponse.statusCode, 200);
      assert.strictEqual(healthResponse.body.status, 'ok');
      assert(healthResponse.body.service, 'Service name should be defined');
      assert(typeof healthResponse.body.uptime === 'number', 'Uptime should be a number');
    });

    const detailedHealthResponse = await makeRequest('/health');
    test('GET /health - Detailed health', () => {
      assert.strictEqual(detailedHealthResponse.statusCode, 200);
      assert.strictEqual(detailedHealthResponse.body.status, 'healthy');
      assert(detailedHealthResponse.body.timestamp, 'Timestamp should be defined');
      assert(detailedHealthResponse.body.memory, 'Memory info should be defined');
      assert(detailedHealthResponse.body.browserPool, 'Browser pool info should be defined');
    });
  } catch (error) {
    console.log(`❌ Health check tests failed: ${error.message}`);
  }

  // Test 2: PDF export endpoint
  try {
    const htmlContent = '<h1>Test Document</h1><p>This is a test.</p>';
    const options = {
      theme: 'dark',
      pageSize: 'A4',
      orientation: 'portrait',
      fileName: 'test-document.pdf'
    };

    const exportResponse = await makeRequest('/export', 'POST', { html: htmlContent, options });
    test('POST /export - Valid request', () => {
      assert.strictEqual(exportResponse.statusCode, 200);
      assert(exportResponse.headers['content-type'].includes('application/pdf'), 'Should return PDF content type');
      assert(exportResponse.headers['content-disposition'].includes('test-document.pdf'), 'Should include filename in disposition');
    });

    // Test without HTML
    const noHtmlResponse = await makeRequest('/export', 'POST', {});
    test('POST /export - No HTML provided', () => {
      assert.strictEqual(noHtmlResponse.statusCode, 400);
      assert.strictEqual(noHtmlResponse.body.error, 'No HTML provided');
    });

    // Test HTML sanitization
    const maliciousHTML = '<h1>Test</h1><script>alert("xss")</script><p>Normal content</p>';
    const sanitizedResponse = await makeRequest('/export', 'POST', { html: maliciousHTML });
    test('POST /export - HTML sanitization', () => {
      assert.strictEqual(sanitizedResponse.statusCode, 200);
      assert(sanitizedResponse.headers['content-type'].includes('application/pdf'), 'Should still work after sanitization');
    });

    // Test file name sanitization
    const dangerousFileName = '../../../etc/passwd<script>alert("xss")</script>.pdf';
    const fileNameResponse = await makeRequest('/export', 'POST', { 
      html: '<p>Test</p>', 
      options: { fileName: dangerousFileName }
    });
    test('POST /export - File name sanitization', () => {
      assert.strictEqual(fileNameResponse.statusCode, 200);
      assert(!fileNameResponse.headers['content-disposition'].includes('../'), 'Should not contain path traversal');
      assert(!fileNameResponse.headers['content-disposition'].includes('<script>'), 'Should not contain script tags');
      assert(fileNameResponse.headers['content-disposition'].includes('.pdf'), 'Should include .pdf extension');
    });

  } catch (error) {
    console.log(`❌ PDF export tests failed: ${error.message}`);
  }

  // Test 3: CORS headers
  try {
    const corsResponse = await makeRequest('/');
    test('CORS Headers', () => {
      assert(corsResponse.headers['access-control-allow-origin'], 'Should have CORS allow origin header');
      assert(corsResponse.headers['access-control-allow-methods'], 'Should have CORS allow methods header');
      assert(corsResponse.headers['access-control-allow-headers'], 'Should have CORS allow headers header');
    });
  } catch (error) {
    console.log(`❌ CORS tests failed: ${error.message}`);
  }

  // Test 4: Security headers
  try {
    const securityResponse = await makeRequest('/');
    test('Security Headers', () => {
      assert(securityResponse.headers['x-content-type-options'], 'Should have X-Content-Type-Options header');
      assert(securityResponse.headers['x-frame-options'], 'Should have X-Frame-Options header');
    });
  } catch (error) {
    console.log(`❌ Security header tests failed: ${error.message}`);
  }

  // Test 5: Rate limiting headers
  try {
    const rateLimitResponse = await makeRequest('/export', 'POST', { html: '<p>Test</p>' });
    test('Rate Limiting Headers', () => {
      assert(rateLimitResponse.headers['x-ratelimit-limit'], 'Should have rate limit header');
      assert(rateLimitResponse.headers['x-ratelimit-remaining'], 'Should have rate remaining header');
    });
  } catch (error) {
    console.log(`❌ Rate limiting tests failed: ${error.message}`);
  }

  console.log(`\n📊 Test Results: ${testsPassed}/${testsTotal} tests passed`);
  
  if (testsPassed === testsTotal) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed.');
    process.exit(1);
  }
}

// Check if server is running before running tests
async function checkServer() {
  try {
    await makeRequest('/');
    console.log('✅ Server is running, starting tests...\n');
    await runTests();
  } catch (error) {
    console.log('❌ Server is not running on port 3000');
    console.log('Please start the server with: npm start');
    process.exit(1);
  }
}

// Run tests
checkServer().catch(console.error);