// @ts-nocheck

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp, TestRepos } from './app-bootstrap';
import { makeProduct, makeProductCategory } from '../helpers/entity-factory';

describe('ProductController (e2e)', () => {
  let app: NestFastifyApplication;
  let repos: TestRepos;

  beforeAll(async () => {
    ({ app, repos } = await bootstrapTestApp());
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /products', () => {
    it('returns 201 for valid product body', async () => {
      const body = { name: 'Laptop', categoryId: 1 };
      repos.productCategory.findById.mockResolvedValue(makeProductCategory({ id: 1 }));
      repos.product.save.mockResolvedValue(makeProduct(body));

      const response = await app.inject({ method: 'POST', url: '/products', payload: body });

      expect(response.statusCode).toBe(201);
    });

    it('returns 400 when name is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/products',
        payload: { categoryId: 1 },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 when categoryId is zero', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/products',
        payload: { name: 'Laptop', categoryId: 0 },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /products', () => {
    it('returns 200 with all products', async () => {
      repos.product.findAll.mockResolvedValue([makeProduct()]);

      const response = await app.inject({ method: 'GET', url: '/products' });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    });

    it('filters by categoryId query param', async () => {
      repos.product.findByCategoryId.mockResolvedValue([makeProduct({ categoryId: 2 })]);

      const response = await app.inject({ method: 'GET', url: '/products?categoryId=2' });

      expect(response.statusCode).toBe(200);
      expect(repos.product.findByCategoryId).toHaveBeenCalledWith(2);
    });
  });

  describe('GET /products/:id', () => {
    it('returns 200 when product exists', async () => {
      repos.product.findById.mockResolvedValue(makeProduct({ id: 1 }));

      const response = await app.inject({ method: 'GET', url: '/products/1' });

      expect(response.statusCode).toBe(200);
    });

    it('returns 400 for non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/products/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /products/:id', () => {
    it('returns 200 after successful update', async () => {
      repos.product.findById.mockResolvedValue(makeProduct({ id: 1 }));
      repos.product.save.mockResolvedValue(makeProduct({ id: 1, name: 'Updated' }));

      const response = await app.inject({
        method: 'PATCH',
        url: '/products/1',
        payload: { name: 'Updated' },
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /products/:id', () => {
    it('returns 204 after successful delete', async () => {
      repos.product.findById.mockResolvedValue(makeProduct({ id: 1 }));
      repos.product.delete.mockResolvedValue(undefined);

      const response = await app.inject({ method: 'DELETE', url: '/products/1' });

      expect(response.statusCode).toBe(204);
    });
  });
});
