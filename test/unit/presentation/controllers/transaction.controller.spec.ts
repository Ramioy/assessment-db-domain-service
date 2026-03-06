// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '@presentation/controllers/transaction.controller';
import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { FindAllTransactionsUseCase } from '@application/use-cases/transaction/find-all-transactions.use-case';
import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { ok } from '@shared/result';
import { makeTransaction } from '../../../helpers/entity-factory';

describe('TransactionController', () => {
  let controller: TransactionController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: CreateTransactionUseCase, useValue: mockCreate },
        { provide: FindTransactionUseCase, useValue: mockFind },
        { provide: FindAllTransactionsUseCase, useValue: mockFindAll },
        { provide: UpdateTransactionUseCase, useValue: mockUpdate },
      ],
    }).compile();

    controller = module.get(TransactionController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('delegates to createUseCase', async () => {
      const dto = { customerId: 1, transactionStatusId: 1, cut: null };
      const saved = makeTransaction(dto);
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('returns all transactions when no customerId given', async () => {
      const txs = [makeTransaction()];
      mockFindAll.execute.mockResolvedValue(ok(txs));

      const result = await controller.findAll(undefined);

      expect(mockFindAll.execute).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(txs);
    });

    it('parses customerId string to number', async () => {
      const txs = [makeTransaction({ customerId: 5 })];
      mockFindAll.execute.mockResolvedValue(ok(txs));

      const result = await controller.findAll('5');

      expect(mockFindAll.execute).toHaveBeenCalledWith(5);
      expect(result).toEqual(txs);
    });
  });

  describe('findOne', () => {
    it('delegates to findUseCase', async () => {
      const tx = makeTransaction({ id: 1 });
      mockFind.execute.mockResolvedValue(ok(tx));

      const result = await controller.findOne(1);

      expect(mockFind.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(tx);
    });
  });

  describe('update', () => {
    it('delegates to updateUseCase', async () => {
      const dto = { transactionStatusId: 2 };
      const updated = makeTransaction({ transactionStatusId: 2 });
      mockUpdate.execute.mockResolvedValue(ok(updated));

      const result = await controller.update(1, dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(updated);
    });
  });
});
