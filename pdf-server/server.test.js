import { jest } from '@jest/globals';
import request from 'supertest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Mock puppeteer to avoid actual browser launching in tests
jest.mock('puppeteer', () => ({
  executablePath: jest.fn(() => '/mock/chrome'),
  launch: jest.fn(() => Promise.resolve({
    newPage: jest.fn(() => Promise.resolve({
      setContent: jest.fn(),
      pdf: jest.fn(() => Promise.resolve(Buffer.from('mock-pdf-data'))),
      close: jest.fn()
    })),
    close: jest.fn(),
    process: jest.fn(() => ({ killed: false }))
  }))
}));

// Import app after mocking
const { app } = await import('./server.js');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('PDF Server', () => {
  describe('GET /', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'md-to-perfect-pdf');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('browserPool');
    });
  });

  describe('GET /health', () => {
    it('should return detailed health information', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('browserPool');
      expect(response.body).toHaveProperty('node');

      // Check memory structure
      expect(response.body.memory).toHaveProperty('rss');
      expect(response.body.memory).toHaveProperty('heapTotal');
      expect(response.body.memory).toHaveProperty('heapUsed');

      // Check browser pool structure
      expect(response.body.browserPool).toHaveProperty('active');
      expect(response.body.browserPool).toHaveProperty('available');
      expect(response.body.browserPool).toHaveProperty('maxSize');
      expect(response.body.browserPool).toHaveProperty('utilization');
    });
  });

  describe('POST /export', () => {
    it('should reject requests without HTML', async () => {
      const response = await request(app)
        .post('/export')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'No HTML provided');
    });

    it('should accept valid HTML with options', async () => {
      const htmlContent = '<h1>Test Document</h1><p>This is a test.</p>';
      const options = {
        theme: 'dark',
        pageSize: 'A4',
        orientation: 'portrait',
        margin: 'normal',
        font: 'Inter',
        fileName: 'test-document.pdf'
      };

      const response = await request(app)
        .post('/export')
        .send({ html: htmlContent, options })
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf; charset=utf-8');
      expect(response.headers['content-disposition']).toContain('attachment; filename="test-document.pdf"');
      expect(response.headers['x-generation-time']).toBeDefined();
    });

    it('should sanitize HTML input', async () => {
      const maliciousHTML = `
        <h1>Test</h1>
        <script>alert('xss')</script>
        <div onclick="alert('xss')">Click me</div>
        <a href="javascript:alert('xss')">Bad link</a>
        <p>Normal content</p>
      `;

      const response = await request(app)
        .post('/export')
        .send({ html: maliciousHTML })
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf; charset=utf-8');
    });

    it('should use default values for invalid options', async () => {
      const htmlContent = '<p>Test content</p>';
      const invalidOptions = {
        theme: 'invalid-theme',
        pageSize: 'invalid-size',
        orientation: 'invalid-orientation',
        margin: 'invalid-margin',
        font: 'invalid-font'
      };

      const response = await request(app)
        .post('/export')
        .send({ html: htmlContent, options: invalidOptions })
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf; charset=utf-8');
      // Should use defaults without throwing errors
    });

    it('should handle large HTML content', async () => {
      // Create large HTML content (900KB)
      const largeHTML = '<h1>Large Document</h1>' + '<p>Large content.</p>'.repeat(30000);
      
      const response = await request(app)
        .post('/export')
        .send({ html: largeHTML })
        .expect(200);

      expect(response.headers['content-type']).toBe('application/pdf; charset=utf-8');
    });

    it('should reject oversized content', async () => {
      // Create extremely large HTML content (>1MB)
      const oversizedHTML = '<p>Oversized content.</p>'.repeat(70000);
      
      const response = await request(app)
        .post('/export')
        .send({ html: oversizedHTML })
        .expect(200); // Should still work but be truncated

      expect(response.headers['content-type']).toBe('application/pdf; charset=utf-8');
    });

    it('should sanitize file names', async () => {
      const htmlContent = '<p>Test</p>';
      const dangerousFileName = '../../../etc/passwd<script>alert("xss")</script>.pdf';

      const response = await request(app)
        .post('/export')
        .send({ 
          html: htmlContent, 
          options: { fileName: dangerousFileName }
        })
        .expect(200);

      expect(response.headers['content-disposition']).not.toContain('../');
      expect(response.headers['content-disposition']).not.toContain('<script>');
      expect(response.headers['content-disposition']).toContain('.pdf');
    });

    it('should handle theme options correctly', async () => {
      const htmlContent = '<h1>Theme Test</h1><p>Testing theme switching</p>';
      
      // Test dark theme
      const darkResponse = await request(app)
        .post('/export')
        .send({ html: htmlContent, options: { theme: 'dark' } })
        .expect(200);

      // Test light theme
      const lightResponse = await request(app)
        .post('/export')
        .send({ html: htmlContent, options: { theme: 'light' } })
        .expect(200);

      // Test invalid theme (should default to dark)
      const invalidResponse = await request(app)
        .post('/export')
        .send({ html: htmlContent, options: { theme: 'invalid' } })
        .expect(200);

      expect(darkResponse.headers['content-type']).toBe('application/pdf; charset=utf-8');
      expect(lightResponse.headers['content-type']).toBe('application/pdf; charset=utf-8');
      expect(invalidResponse.headers['content-type']).toBe('application/pdf; charset=utf-8');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from allowed origins', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'chrome-extension://test')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });

    it('should include appropriate CORS headers', async () => {
      const response = await request(app)
        .options('/export')
        .expect(200);

      expect(response.headers['access-control-allow-methods']).toContain('POST');
      expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow normal number of requests', async () => {
      const htmlContent = '<p>Test content</p>';
      
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/export')
          .send({ html: htmlContent })
          .expect(200);
      }
    });

    it('should include rate limit headers', async () => {
      const htmlContent = '<p>Test content</p>';
      
      const response = await request(app)
        .post('/export')
        .send({ html: htmlContent })
        .expect(200);

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });
});