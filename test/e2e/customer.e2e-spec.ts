// @ts-nocheck
/* eslint-disable */
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp, TestRepos } from './app-bootstrap';
import { makeCustomer, makeCustomerDocumentType } from '../helpers/entity-factory';

describe('CustomerController (e2e)', () => {
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

  const validCustomerBody = {
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'john@example.com',
  };

  describe('POST /customers', () => {
    it('returns 201 for valid body', async () => {
      repos.customerDocumentType.findById.mockResolvedValue(makeCustomerDocumentType({ id: 1 }));
      repos.customer.findByEmail.mockResolvedValue(null);
      repos.customer.findByDocumentNumber.mockResolvedValue(null);
      repos.customer.save.mockResolvedValue(makeCustomer(validCustomerBody));

      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: validCustomerBody,
      });

      expect(response.statusCode).toBe(201);
    });

    it('returns 400 when email is invalid', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: { ...validCustomerBody, email: 'not-an-email' },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 when documentNumber is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: { customerDocumentTypeId: 1, email: 'a@b.com' },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /customers', () => {
    it('returns 200 with array', async () => {
      repos.customer.findAll.mockResolvedValue([makeCustomer()]);

      const response = await app.inject({ method: 'GET', url: '/customers' });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    });
  });

  describe('GET /customers/:id', () => {
    it('returns 200 when customer exists', async () => {
      repos.customer.findById.mockResolvedValue(makeCustomer({ id: 1 }));

      const response = await app.inject({ method: 'GET', url: '/customers/1' });

      expect(response.statusCode).toBe(200);
    });

    it('returns 400 for non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/customers/abc' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /customers/:id', () => {
    it('returns 200 after successful update', async () => {
      repos.customer.findById.mockResolvedValue(makeCustomer({ id: 1 }));
      repos.customer.save.mockResolvedValue(makeCustomer({ id: 1, address: 'New address' }));

      const response = await app.inject({
        method: 'PATCH',
        url: '/customers/1',
        payload: { address: 'New address' },
      });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('DELETE /customers/:id', () => {
    it('returns 204 after successful delete', async () => {
      repos.customer.findById.mockResolvedValue(makeCustomer({ id: 1 }));
      repos.customer.delete.mockResolvedValue(undefined);

      const response = await app.inject({ method: 'DELETE', url: '/customers/1' });

      expect(response.statusCode).toBe(204);
    });
  });
});
