import request from 'supertest';
import app from '../src/app';

describe('CORS Configuration Tests', () => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://example-subdomain.trycloudflare.com',
    'https://quick-tunnel-12345.trycloudflare.com',
    'https://abc-def-ghi.trycloudflare.com',
    'https://test.ngrok-free.dev',
  ];

  describe('Allowed Origins', () => {
    test.each(allowedOrigins)('should allow request from %s with credentials', async (origin) => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', origin);

      expect(res.headers['access-control-allow-origin']).toBe(origin);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.status).toBe(200);
    });

    test.each(allowedOrigins)('should handle preflight OPTIONS for %s', async (origin) => {
      const res = await request(app)
        .options('/api/v1/auth/login')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization');

      expect(res.headers['access-control-allow-origin']).toBe(origin);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.headers['access-control-allow-methods']).toBeDefined();
      expect([200, 204]).toContain(res.status);
    });
  });

  describe('Login and Authenticated API requests through Cloudflare Tunnel', () => {
    const cloudflareOrigin = 'https://my-quick-tunnel.trycloudflare.com';
    const localhostOrigin = 'http://localhost:5173';

    test('should allow login request from localhost with CORS headers', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Origin', localhostOrigin)
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        });

      // Even on 401 Unauthorized, CORS headers must be present so browser frontend can read response
      expect(res.headers['access-control-allow-origin']).toBe(localhostOrigin);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.status).toBe(401);
    });

    test('should allow login request from Cloudflare tunnel with CORS headers', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .set('Origin', cloudflareOrigin)
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword',
        });

      expect(res.headers['access-control-allow-origin']).toBe(cloudflareOrigin);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.status).toBe(401);
    });

    test('should allow authenticated requests from Cloudflare tunnel with CORS headers', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Origin', cloudflareOrigin)
        .set('Authorization', 'Bearer invalid-token');

      expect(res.headers['access-control-allow-origin']).toBe(cloudflareOrigin);
      expect(res.headers['access-control-allow-credentials']).toBe('true');
      expect(res.status).toBe(401);
    });
  });

  describe('Disallowed Origins', () => {
    const disallowedOrigins = [
      'https://malicious-site.com',
      'http://attacker.com',
      'https://fake-trycloudflare.com.attacker.com',
      'https://trycloudflare.com.malicious.io',
    ];

    test.each(disallowedOrigins)('should reject request from %s', async (origin) => {
      const res = await request(app)
        .get('/api/v1/health')
        .set('Origin', origin);

      expect(res.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('No Origin header (curl / server-to-server / mobile)', () => {
    test('should allow requests without origin', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
