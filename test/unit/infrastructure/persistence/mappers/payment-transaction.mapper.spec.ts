// @ts-nocheck

import { PaymentTransactionMapper } from '@infrastructure/persistence/mappers/payment-transaction.mapper';
import { PaymentTransactionOrmEntity } from '@infrastructure/persistence/entities/payment-transaction.orm-entity';
import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { makePaymentTransaction } from '../../../../helpers/entity-factory';

describe('PaymentTransactionMapper', () => {
  const NOW = new Date('2024-01-15T10:00:00.000Z');
  const ID = '11111111-2222-4333-8444-555555555555';

  function makeOrm(overrides: Partial<PaymentTransactionOrmEntity> = {}): PaymentTransactionOrmEntity {
    return Object.assign(new PaymentTransactionOrmEntity(), {
      id: ID,
      createdAt: NOW,
      updatedAt: NOW,
      providerId: null,
      reference: 'ref-order-001',
      amountInCents: '10000', // bigint returned as string by TypeORM
      currency: 'COP',
      status: 'PENDING',
      statusMessage: null,
      paymentMethod: 'CARD',
      customerEmail: 'customer@example.com',
      customerIp: '192.168.1.1',
      signature: 'abc123signaturevalue',
      providerResponse: null,
      ...overrides,
    });
  }

  describe('toDomain()', () => {
    it('maps ORM entity to domain entity', () => {
      const orm = makeOrm();
      const domain = PaymentTransactionMapper.toDomain(orm);

      expect(domain).toBeInstanceOf(PaymentTransaction);
      expect(domain.id).toBe(ID);
      expect(domain.reference).toBe('ref-order-001');
      expect(domain.currency).toBe('COP');
      expect(domain.status).toBe('PENDING');
      expect(domain.paymentMethod).toBe('CARD');
      expect(domain.customerEmail).toBe('customer@example.com');
      expect(domain.customerIp).toBe('192.168.1.1');
      expect(domain.signature).toBe('abc123signaturevalue');
      expect(domain.createdAt).toBe(NOW);
      expect(domain.updatedAt).toBe(NOW);
    });

    it('converts amountInCents from string to number', () => {
      const orm = makeOrm({ amountInCents: '99500' });
      const domain = PaymentTransactionMapper.toDomain(orm);

      expect(domain.amountInCents).toBe(99500);
      expect(typeof domain.amountInCents).toBe('number');
    });

    it('maps null providerId correctly', () => {
      const orm = makeOrm({ providerId: null });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.providerId).toBeNull();
    });

    it('maps non-null providerId correctly', () => {
      const orm = makeOrm({ providerId: 'prov-abc-123' });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.providerId).toBe('prov-abc-123');
    });

    it('maps null statusMessage correctly', () => {
      const orm = makeOrm({ statusMessage: null });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.statusMessage).toBeNull();
    });

    it('maps non-null statusMessage correctly', () => {
      const orm = makeOrm({ statusMessage: 'Transaction approved' });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.statusMessage).toBe('Transaction approved');
    });

    it('maps null customerIp correctly', () => {
      const orm = makeOrm({ customerIp: null });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.customerIp).toBeNull();
    });

    it('maps null providerResponse correctly', () => {
      const orm = makeOrm({ providerResponse: null });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.providerResponse).toBeNull();
    });

    it('maps JSONB providerResponse object correctly', () => {
      const response = { transactionId: 'tx-001', code: '200', status: 'APPROVED' };
      const orm = makeOrm({ providerResponse: response });
      const domain = PaymentTransactionMapper.toDomain(orm);
      expect(domain.providerResponse).toEqual(response);
    });
  });

  describe('toOrm()', () => {
    it('maps domain entity to ORM entity', () => {
      const entity = makePaymentTransaction();
      const orm = PaymentTransactionMapper.toOrm(entity);

      expect(orm).toBeInstanceOf(PaymentTransactionOrmEntity);
      expect(orm.id).toBe(entity.id);
      expect(orm.reference).toBe(entity.reference);
      expect(orm.currency).toBe(entity.currency);
      expect(orm.status).toBe(entity.status);
      expect(orm.paymentMethod).toBe(entity.paymentMethod);
      expect(orm.customerEmail).toBe(entity.customerEmail);
      expect(orm.signature).toBe(entity.signature);
    });

    it('always sets id (UUID is caller-supplied, never skipped)', () => {
      const entity = makePaymentTransaction({ id: ID });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.id).toBe(ID);
    });

    it('converts amountInCents from number to string', () => {
      const entity = makePaymentTransaction({ amountInCents: 75000 });
      const orm = PaymentTransactionMapper.toOrm(entity);

      expect(orm.amountInCents).toBe('75000');
      expect(typeof orm.amountInCents).toBe('string');
    });

    it('maps null providerId to null', () => {
      const entity = makePaymentTransaction({ providerId: null });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.providerId).toBeNull();
    });

    it('maps non-null providerId', () => {
      const entity = makePaymentTransaction({ providerId: 'prov-xyz' });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.providerId).toBe('prov-xyz');
    });

    it('maps null statusMessage to null', () => {
      const entity = makePaymentTransaction({ statusMessage: null });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.statusMessage).toBeNull();
    });

    it('maps null customerIp to null', () => {
      const entity = makePaymentTransaction({ customerIp: null });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.customerIp).toBeNull();
    });

    it('maps null providerResponse to null', () => {
      const entity = makePaymentTransaction({ providerResponse: null });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.providerResponse).toBeNull();
    });

    it('maps providerResponse object correctly', () => {
      const response = { code: '200', message: 'Approved' };
      const entity = makePaymentTransaction({ providerResponse: response });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.providerResponse).toEqual(response);
    });

    it('maps customerIp when provided', () => {
      const entity = makePaymentTransaction({ customerIp: '10.0.0.1' });
      const orm = PaymentTransactionMapper.toOrm(entity);
      expect(orm.customerIp).toBe('10.0.0.1');
    });
  });

  describe('round-trip', () => {
    it('toDomain(toOrm(entity)) preserves all fields', () => {
      const original = makePaymentTransaction({
        id: ID,
        providerId: 'prov-roundtrip',
        amountInCents: 25000,
        status: 'APPROVED',
        statusMessage: 'Approved by provider',
        customerIp: '172.16.0.1',
        providerResponse: { code: '200' },
      });

      const orm = PaymentTransactionMapper.toOrm(original);
      // Simulate TypeORM timestamps (not set by toOrm, inject manually)
      orm.createdAt = original.createdAt;
      orm.updatedAt = original.updatedAt;
      const restored = PaymentTransactionMapper.toDomain(orm);

      expect(restored.id).toBe(original.id);
      expect(restored.providerId).toBe(original.providerId);
      expect(restored.reference).toBe(original.reference);
      expect(restored.amountInCents).toBe(original.amountInCents);
      expect(restored.currency).toBe(original.currency);
      expect(restored.status).toBe(original.status);
      expect(restored.statusMessage).toBe(original.statusMessage);
      expect(restored.paymentMethod).toBe(original.paymentMethod);
      expect(restored.customerEmail).toBe(original.customerEmail);
      expect(restored.customerIp).toBe(original.customerIp);
      expect(restored.signature).toBe(original.signature);
      expect(restored.providerResponse).toEqual(original.providerResponse);
    });
  });
});
