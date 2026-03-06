// @ts-nocheck

import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { bootstrapTestApp, TestRepos } from './app-bootstrap';
import { makeCustomer, makeDelivery, makeTransaction } from '../helpers/entity-factory';

describe('DeliveryController (e2e)', () => {
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

  const validDeliveryBody = { customerId: 1, transactionId: 1 };

  describe('POST /deliveries', () => {
    it('returns 201 for valid body', async () => {
      repos.customer.findById.mockResolvedValue(makeCustomer({ id: 1 }));
      repos.transaction.findById.mockResolvedValue(makeTransaction({ id: 1 }));
      repos.delivery.save.mockResolvedValue(makeDelivery(validDeliveryBody));

      const response = await app.inject({
        method: 'POST',
        url: '/deliveries',
        payload: validDeliveryBody,
      });

      expect(response.statusCode).toBe(201);
    });

    it('returns 400 when customerId is missing', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/deliveries',
        payload: { transactionId: 1 },
      });

      expect(response.statusCode).toBe(400);
    });

    it('returns 400 when transactionId is non-positive', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/deliveries',
        payload: { customerId: 1, transactionId: 0 },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /deliveries', () => {
    it('returns 200 with all deliveries', async () => {
      repos.delivery.findAll.mockResolvedValue([makeDelivery()]);

      const response = await app.inject({ method: 'GET', url: '/deliveries' });

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.json())).toBe(true);
    });

    it('filters by transactionId query param', async () => {
      repos.delivery.findByTransactionId.mockResolvedValue([makeDelivery({ transactionId: 5 })]);

      const response = await app.inject({ method: 'GET', url: '/deliveries?transactionId=5' });

      expect(response.statusCode).toBe(200);
      expect(repos.delivery.findByTransactionId).toHaveBeenCalledWith(5);
    });

    it('filters by customerId query param when transactionId not provided', async () => {
      repos.delivery.findByCustomerId.mockResolvedValue([makeDelivery({ customerId: 2 })]);

      const response = await app.inject({ method: 'GET', url: '/deliveries?customerId=2' });

      expect(response.statusCode).toBe(200);
      expect(repos.delivery.findByCustomerId).toHaveBeenCalledWith(2);
    });
  });

  describe('GET /deliveries/:id', () => {
    it('returns 200 when delivery exists', async () => {
      repos.delivery.findById.mockResolvedValue(makeDelivery({ id: 1 }));

      const response = await app.inject({ method: 'GET', url: '/deliveries/1' });

      expect(response.statusCode).toBe(200);
    });

    it('returns 400 for non-numeric id', async () => {
      const response = await app.inject({ method: 'GET', url: '/deliveries/nope' });

      expect(response.statusCode).toBe(400);
    });
  });
});
