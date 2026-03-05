import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp, TestRepos } from './app-bootstrap';
import { makeProductCategory } from '../helpers/entity-factory';

describe('ProductCategoryController (e2e)', () => {
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

  // ── POST /product-categories ─────────────────────────────────

  describe('POST /product-categories', () => {
    it('returns 201 and created category for valid body', async () => {
      const body = { name: 'Electronics', description: 'Devices' };
      const saved = makeProductCategory(body);
      repos.productCategory.findByName.mockResolvedValue(null);
      repos.productCategory.save.mockResolvedValue(saved);

      const response = await app.inject({
        method: 'POST',
        url: '/product-categories',
        payload: body,
      });

      expect(response.statusCode).toBe(201);
      const json = response.json<{ name: string }>();
      expect(json.name).toBe('Electronics');
    });

    it('returns 400 when name is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/product-categories',
        payload: { description: 'No name provided' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 when name is empty string', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/product-categories',
        payload: { name: '' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  // ── GET /product-categories ──────────────────────────────────

  describe('GET /product-categories', () => {
    it('returns 200 with array of categories', async () => {
      const categories = [
        makeProductCategory({ id: 1 }),
        makeProductCategory({ id: 2, name: 'Clothing' }),
      ];
      repos.productCategory.findAll.mockResolvedValue(categories);

      const response = await app.inject({ method: 'GET', url: '/product-categories' });

      expect(response.statusCode).toBe(200);
      const json = response.json<unknown[]>();
      expect(Array.isArray(json)).toBe(true);
      expect(json).toHaveLength(2);
    });
  });

  // ── GET /product-categories/:id ──────────────────────────────

  describe('GET /product-categories/:id', () => {
    it('returns 200 with category when found', async () => {
      const cat = makeProductCategory({ id: 1 });
      repos.productCategory.findById.mockResolvedValue(cat);

      const response = await app.inject({ method: 'GET', url: '/product-categories/1' });

      expect(response.statusCode).toBe(200);
    });

    it('returns 500 when category not found (domain NotFoundException mapped by filter)', async () => {
      repos.productCategory.findById.mockResolvedValue(null);

      const response = await app.inject({ method: 'GET', url: '/product-categories/999' });

      // DomainException is not an HttpException; filter returns 500
      expect(response.statusCode).toBe(500);
    });

    it('returns 400 for non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/product-categories/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  // ── PATCH /product-categories/:id ────────────────────────────

  describe('PATCH /product-categories/:id', () => {
    it('returns 200 with updated category', async () => {
      const existing = makeProductCategory({ id: 1 });
      const dto = { name: 'Updated Electronics' };
      repos.productCategory.findById.mockResolvedValue(existing);
      repos.productCategory.save.mockResolvedValue(
        makeProductCategory({ id: 1, name: 'Updated Electronics' }),
      );

      const response = await app.inject({
        method: 'PATCH',
        url: '/product-categories/1',
        payload: dto,
      });

      expect(response.statusCode).toBe(200);
    });

    it('returns 400 for empty name on update', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/product-categories/1',
        payload: { name: '' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  // ── DELETE /product-categories/:id ───────────────────────────

  describe('DELETE /product-categories/:id', () => {
    it('returns 204 when category is deleted', async () => {
      repos.productCategory.findById.mockResolvedValue(makeProductCategory({ id: 1 }));
      repos.productCategory.delete.mockResolvedValue(undefined);

      const response = await app.inject({ method: 'DELETE', url: '/product-categories/1' });

      expect(response.statusCode).toBe(204);
    });
  });
});
