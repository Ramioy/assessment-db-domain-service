// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PaymentTransactionController } from '@presentation/controllers/payment-transaction.controller';
import { CreatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/create-payment-transaction.use-case';
import { FindPaymentTransactionUseCase } from '@application/use-cases/payment-transaction/find-payment-transaction.use-case';
import { FindAllPaymentTransactionsUseCase } from '@application/use-cases/payment-transaction/find-all-payment-transactions.use-case';
import { UpdatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/update-payment-transaction.use-case';
import { ok, err } from '@shared/result';
import { NotFoundError, AlreadyExistsError } from '@domain/errors';
import { makePaymentTransaction } from '../../../helpers/entity-factory';

describe('PaymentTransactionController', () => {
  let controller: PaymentTransactionController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = {
    execute: jest.fn(),
    executeByReference: jest.fn(),
    executeByProviderId: jest.fn(),
  };
  const mockFindAll = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };

  const ID = '11111111-2222-4333-8444-555555555555';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentTransactionController],
      providers: [
        { provide: CreatePaymentTransactionUseCase, useValue: mockCreate },
        { provide: FindPaymentTransactionUseCase, useValue: mockFind },
        { provide: FindAllPaymentTransactionsUseCase, useValue: mockFindAll },
        { provide: UpdatePaymentTransactionUseCase, useValue: mockUpdate },
      ],
    }).compile();

    controller = module.get(PaymentTransactionController);
    jest.clearAllMocks();
  });

  // ── create ────────────────────────────────────────────────────

  describe('create()', () => {
    const dto = {
      id: ID,
      reference: 'ref-order-001',
      amountInCents: 10000,
      currency: 'COP',
      status: 'PENDING',
      paymentMethod: 'CARD',
      customerEmail: 'customer@example.com',
      signature: 'sig-abc',
      providerId: null,
      statusMessage: null,
      customerIp: null,
      providerResponse: null,
    };

    it('delegates to createUseCase and returns the entity', async () => {
      const saved = makePaymentTransaction();
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });

    it('throws ConflictException when reference already exists', async () => {
      mockCreate.execute.mockResolvedValue(
        err(new AlreadyExistsError('PaymentTransaction', 'reference', 'ref-order-001')),
      );

      await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ── findAll ───────────────────────────────────────────────────

  describe('findAll()', () => {
    it('returns all payment transactions', async () => {
      const transactions = [makePaymentTransaction(), makePaymentTransaction()];
      mockFindAll.execute.mockResolvedValue(ok(transactions));

      const result = await controller.findAll();

      expect(mockFindAll.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(transactions);
    });

    it('returns empty array when no transactions exist', async () => {
      mockFindAll.execute.mockResolvedValue(ok([]));

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── findOne ───────────────────────────────────────────────────

  describe('findOne()', () => {
    it('delegates to findUseCase.execute with UUID string', async () => {
      const pt = makePaymentTransaction({ id: ID });
      mockFind.execute.mockResolvedValue(ok(pt));

      const result = await controller.findOne(ID);

      expect(mockFind.execute).toHaveBeenCalledWith(ID);
      expect(result).toBe(pt);
    });

    it('throws NotFoundException when not found', async () => {
      mockFind.execute.mockResolvedValue(err(new NotFoundError('PaymentTransaction', ID)));

      await expect(controller.findOne(ID)).rejects.toThrow(NotFoundException);
    });
  });

  // ── findByReference ───────────────────────────────────────────

  describe('findByReference()', () => {
    it('delegates to findUseCase.executeByReference', async () => {
      const pt = makePaymentTransaction({ reference: 'ref-order-001' });
      mockFind.executeByReference.mockResolvedValue(ok(pt));

      const result = await controller.findByReference('ref-order-001');

      expect(mockFind.executeByReference).toHaveBeenCalledWith('ref-order-001');
      expect(result).toBe(pt);
    });

    it('throws NotFoundException when reference not found', async () => {
      mockFind.executeByReference.mockResolvedValue(
        err(new NotFoundError('PaymentTransaction', 'ref-order-001')),
      );

      await expect(controller.findByReference('ref-order-001')).rejects.toThrow(NotFoundException);
    });
  });

  // ── findByProviderId ──────────────────────────────────────────

  describe('findByProviderId()', () => {
    it('delegates to findUseCase.executeByProviderId', async () => {
      const pt = makePaymentTransaction({ providerId: 'prov-999' });
      mockFind.executeByProviderId.mockResolvedValue(ok(pt));

      const result = await controller.findByProviderId('prov-999');

      expect(mockFind.executeByProviderId).toHaveBeenCalledWith('prov-999');
      expect(result).toBe(pt);
    });

    it('throws NotFoundException when providerId not found', async () => {
      mockFind.executeByProviderId.mockResolvedValue(
        err(new NotFoundError('PaymentTransaction', 'prov-999')),
      );

      await expect(controller.findByProviderId('prov-999')).rejects.toThrow(NotFoundException);
    });
  });

  // ── updateStatus ──────────────────────────────────────────────

  describe('updateStatus()', () => {
    const updateDto = { status: 'APPROVED', providerId: 'prov-123' };

    it('delegates to updateUseCase and returns updated entity', async () => {
      const updated = makePaymentTransaction({ status: 'APPROVED' });
      mockUpdate.execute.mockResolvedValue(ok(updated));

      const result = await controller.updateStatus(ID, updateDto);

      expect(mockUpdate.execute).toHaveBeenCalledWith(ID, updateDto);
      expect(result).toBe(updated);
    });

    it('throws NotFoundException when transaction not found', async () => {
      mockUpdate.execute.mockResolvedValue(err(new NotFoundError('PaymentTransaction', ID)));

      await expect(controller.updateStatus(ID, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('passes UUID string directly (no parseInt)', async () => {
      const updated = makePaymentTransaction({ id: ID });
      mockUpdate.execute.mockResolvedValue(ok(updated));

      await controller.updateStatus(ID, updateDto);

      const calledId = mockUpdate.execute.mock.calls[0][0];
      expect(typeof calledId).toBe('string');
      expect(calledId).toBe(ID);
    });
  });
});
