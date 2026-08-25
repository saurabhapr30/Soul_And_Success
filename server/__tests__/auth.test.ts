import request from 'supertest';
import app from '../src/app';

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'Password123',
        name: 'Test User'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should fail registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com'
      });
      
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('success', false);
  });
});
