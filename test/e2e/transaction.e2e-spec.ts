// @ts-nocheck

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp, TestRepos } from './app-bootstrap';
import { makeCustomer, makeTransaction, makeTransactionStatus } from '../helpers/entity-factory';

describe('TransactionController (e2e)', () => {
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

  const validTxBody = { customerId: 1, transactionStatusId: 1 };

  describe('POST /transactions', () => {
    it('returns 201 for valid body', async () => {
      repos.customer.findById.mockResolvedValue(makeCustomer({ id: 1 }));
      repos.transactionStatus.findById.mockResolvedValue(makeTransactionStatus({ id: 1 }));
      repos.transaction.save.mockResolvedValue(makeTransaction(validTxBody));

      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload: validTxBody,
      });

      expect(response.statusCode).toBe(201);
    });

    it('returns 400 when customerId is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload: { transactionStatusId: 1 },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 when customerId is non-positive', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/transactions',
        payload: { customerId: 0, transactionStatusId: 1 },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /transactions', () => {
    it('returns 200 with all transactions', async () => {
      repos.transaction.findAll.mockResolvedValue([makeTransaction()]);

      const response = await app.inject({ method: 'GET', url: '/transactions' });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    });

    it('filters by customerId query param', async () => {
      repos.transaction.findByCustomerId.mockResolvedValue([makeTransaction({ customerId: 3 })]);

      const response = await app.inject({ method: 'GET', url: '/transactions?customerId=3' });

      expect(response.statusCode).toBe(200);
      expect(repos.transaction.findByCustomerId).toHaveBeenCalledWith(3);
    });
  });

  describe('GET /transactions/:id', () => {
    it('returns 200 when transaction exists', async () => {
      repos.transaction.findById.mockResolvedValue(makeTransaction({ id: 1 }));

      const response = await app.inject({ method: 'GET', url: '/transactions/1' });

      expect(response.statusCode).toBe(200);
    });

    it('returns 400 for non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/transactions/xyz' });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PATCH /transactions/:id', () => {
    it('returns 200 after successful status update', async () => {
      repos.transaction.findById.mockResolvedValue(makeTransaction({ id: 1 }));
      repos.transactionStatus.findById.mockResolvedValue(
        makeTransactionStatus({ id: 2, name: 'APPROVED' }),
      );
      repos.transaction.save.mockResolvedValue(makeTransaction({ id: 1, transactionStatusId: 2 }));

      const response = await app.inject({
        method: 'PATCH',
        url: '/transactions/1',
        payload: { transactionStatusId: 2 },
      });

      expect(response.statusCode).toBe(200);
    });

    it('returns 200 with empty patch body (all optional)', async () => {
      repos.transaction.findById.mockResolvedValue(makeTransaction({ id: 1 }));
      repos.transaction.save.mockResolvedValue(makeTransaction({ id: 1 }));

      const response = await app.inject({
        method: 'PATCH',
        url: '/transactions/1',
        payload: {},
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
