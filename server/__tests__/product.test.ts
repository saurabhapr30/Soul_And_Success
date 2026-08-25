import request from 'supertest';
import app from '../src/app';

describe('Product Endpoints', () => {
  it('should get all products', async () => {
    const res = await request(app).get('/api/v1/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBeTruthy();
  });
});
