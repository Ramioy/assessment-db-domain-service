// @ts-nocheck
/* eslint-disable */
import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { makePaymentTransaction } from '../../../helpers/entity-factory';

describe('PaymentTransaction', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');

  const baseCreateDto = {
    id: '11111111-2222-4333-8444-555555555555',
    reference: 'ref-order-001',
    amountInCents: 10000,
    currency: 'COP',
    paymentMethod: 'CARD',
    customerEmail: 'customer@example.com',
    signature: 'abc123signaturevalue',
    providerId: null,
    status: null,
    statusMessage: null,
    customerIp: null,
    providerResponse: null,
  };

  describe('create()', () => {
    it('sets id from dto (caller-supplied UUID)', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.id).toBe('11111111-2222-4333-8444-555555555555');
    });

    it('defaults status to PENDING when not provided', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.status).toBe('PENDING');
    });

    it('uses provided status when given', () => {
      const pt = PaymentTransaction.create({ ...baseCreateDto, status: 'APPROVED' });
      expect(pt.status).toBe('APPROVED');
    });

    it('defaults providerId to null', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.providerId).toBeNull();
    });

    it('uses provided providerId', () => {
      const pt = PaymentTransaction.create({ ...baseCreateDto, providerId: 'prov-999' });
      expect(pt.providerId).toBe('prov-999');
    });

    it('defaults statusMessage to null', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.statusMessage).toBeNull();
    });

    it('defaults providerResponse to null', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.providerResponse).toBeNull();
    });

    it('defaults customerIp to null', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.customerIp).toBeNull();
    });

    it('uses provided customerIp', () => {
      const pt = PaymentTransaction.create({ ...baseCreateDto, customerIp: '10.0.0.1' });
      expect(pt.customerIp).toBe('10.0.0.1');
    });

    it('sets createdAt and updatedAt to current time', () => {
      const before = new Date();
      const pt = PaymentTransaction.create(baseCreateDto);
      const after = new Date();
      expect(pt.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(pt.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(pt.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });

    it('maps all required fields correctly', () => {
      const pt = PaymentTransaction.create(baseCreateDto);
      expect(pt.reference).toBe('ref-order-001');
      expect(pt.amountInCents).toBe(10000);
      expect(pt.currency).toBe('COP');
      expect(pt.paymentMethod).toBe('CARD');
      expect(pt.customerEmail).toBe('customer@example.com');
      expect(pt.signature).toBe('abc123signaturevalue');
    });

    it('accepts providerResponse as object', () => {
      const response = { transactionId: 'tx-001', code: '200' };
      const pt = PaymentTransaction.create({ ...baseCreateDto, providerResponse: response });
      expect(pt.providerResponse).toEqual(response);
    });
  });

  describe('fromPersistence()', () => {
    it('reconstitutes all fields from persistence data', () => {
      const pt = PaymentTransaction.fromPersistence({
        id: '11111111-2222-4333-8444-555555555555',
        providerId: 'prov-123',
        reference: 'ref-order-001',
        amountInCents: 50000,
        currency: 'COP',
        status: 'APPROVED',
        statusMessage: 'Transaction approved',
        paymentMethod: 'CARD',
        customerEmail: 'customer@example.com',
        customerIp: '192.168.1.1',
        signature: 'sig-value',
        providerResponse: { code: '200' },
        createdAt: NOW,
        updatedAt: NOW,
      });

      expect(pt).toBeInstanceOf(PaymentTransaction);
      expect(pt.id).toBe('11111111-2222-4333-8444-555555555555');
      expect(pt.providerId).toBe('prov-123');
      expect(pt.reference).toBe('ref-order-001');
      expect(pt.amountInCents).toBe(50000);
      expect(pt.currency).toBe('COP');
      expect(pt.status).toBe('APPROVED');
      expect(pt.statusMessage).toBe('Transaction approved');
      expect(pt.paymentMethod).toBe('CARD');
      expect(pt.customerEmail).toBe('customer@example.com');
      expect(pt.customerIp).toBe('192.168.1.1');
      expect(pt.signature).toBe('sig-value');
      expect(pt.providerResponse).toEqual({ code: '200' });
      expect(pt.createdAt).toBe(NOW);
      expect(pt.updatedAt).toBe(NOW);
    });

    it('handles null nullable fields', () => {
      const pt = makePaymentTransaction({ providerId: null, statusMessage: null, customerIp: null, providerResponse: null });
      expect(pt.providerId).toBeNull();
      expect(pt.statusMessage).toBeNull();
      expect(pt.customerIp).toBeNull();
      expect(pt.providerResponse).toBeNull();
    });
  });

  describe('applyStatusUpdate()', () => {
    it('returns a new instance (immutable)', () => {
      const original = makePaymentTransaction();
      const updated = original.applyStatusUpdate({ status: 'APPROVED' });
      expect(updated).not.toBe(original);
    });

    it('updates status', () => {
      const original = makePaymentTransaction({ status: 'PENDING' });
      const updated = original.applyStatusUpdate({ status: 'APPROVED' });
      expect(updated.status).toBe('APPROVED');
    });

    it('updates providerId', () => {
      const original = makePaymentTransaction({ providerId: null });
      const updated = original.applyStatusUpdate({ providerId: 'prov-999' });
      expect(updated.providerId).toBe('prov-999');
    });

    it('updates statusMessage', () => {
      const original = makePaymentTransaction({ statusMessage: null });
      const updated = original.applyStatusUpdate({ statusMessage: 'Approved by Wompi' });
      expect(updated.statusMessage).toBe('Approved by Wompi');
    });

    it('updates providerResponse', () => {
      const original = makePaymentTransaction({ providerResponse: null });
      const response = { transactionId: 'tx-abc' };
      const updated = original.applyStatusUpdate({ providerResponse: response });
      expect(updated.providerResponse).toEqual(response);
    });

    it('preserves unchanged fields', () => {
      const original = makePaymentTransaction();
      const updated = original.applyStatusUpdate({ status: 'DECLINED' });
      expect(updated.id).toBe(original.id);
      expect(updated.reference).toBe(original.reference);
      expect(updated.amountInCents).toBe(original.amountInCents);
      expect(updated.currency).toBe(original.currency);
      expect(updated.paymentMethod).toBe(original.paymentMethod);
      expect(updated.customerEmail).toBe(original.customerEmail);
      expect(updated.customerIp).toBe(original.customerIp);
      expect(updated.signature).toBe(original.signature);
      expect(updated.createdAt).toBe(original.createdAt);
    });

    it('updates updatedAt to a new time', () => {
      const original = makePaymentTransaction();
      const before = new Date();
      const updated = original.applyStatusUpdate({ status: 'APPROVED' });
      const after = new Date();
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(updated.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('handles partial update with empty dto (preserves all fields)', () => {
      const original = makePaymentTransaction({ status: 'PENDING', providerId: 'prov-1' });
      const updated = original.applyStatusUpdate({});
      expect(updated.status).toBe('PENDING');
      expect(updated.providerId).toBe('prov-1');
    });

    it('can set providerId to null', () => {
      const original = makePaymentTransaction({ providerId: 'prov-123' });
      const updated = original.applyStatusUpdate({ providerId: null });
      expect(updated.providerId).toBeNull();
    });

    it('can set statusMessage to null', () => {
      const original = makePaymentTransaction({ statusMessage: 'some message' });
      const updated = original.applyStatusUpdate({ statusMessage: null });
      expect(updated.statusMessage).toBeNull();
    });
  });
});
