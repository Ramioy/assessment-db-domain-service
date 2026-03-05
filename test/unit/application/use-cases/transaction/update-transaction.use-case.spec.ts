// @ts-nocheck
/* eslint-disable */
import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import {
  makeMockTransactionRepository,
  makeMockTransactionStatusRepository,
} from '../../../../helpers/mock-repositories';
import { makeTransaction, makeTransactionStatus } from '../../../../helpers/entity-factory';

describe('UpdateTransactionUseCase', () => {
  let useCase: UpdateTransactionUseCase;
  let transactionRepo: ReturnType<typeof makeMockTransactionRepository>;
  let statusRepo: ReturnType<typeof makeMockTransactionStatusRepository>;

  beforeEach(() => {
    transactionRepo = makeMockTransactionRepository();
    statusRepo = makeMockTransactionStatusRepository();
    useCase = new UpdateTransactionUseCase(transactionRepo, statusRepo);
  });

  it('updates and returns the transaction without statusId change', async () => {
    const existing = makeTransaction({ id: 1, cut: null });
    const dto = { cut: 'CUT-001' };
    const saved = makeTransaction({ id: 1, cut: 'CUT-001' });
    transactionRepo.findById.mockResolvedValue(ok(existing));
    transactionRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(1, dto);

    expect(transactionRepo.findById).toHaveBeenCalledWith(1);
    expect(statusRepo.findById).not.toHaveBeenCalled();
    expect(transactionRepo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('validates statusId when provided in dto', async () => {
    const existing = makeTransaction({ id: 1 });
    const dto = { transactionStatusId: 2 };
    transactionRepo.findById.mockResolvedValue(ok(existing));
    statusRepo.findById.mockResolvedValue(ok(makeTransactionStatus({ id: 2, name: 'APPROVED' })));
    transactionRepo.save.mockImplementation((e) => Promise.resolve(ok(e)));

    const result = await useCase.execute(1, dto);

    expect(statusRepo.findById).toHaveBeenCalledWith(2);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.transactionStatusId).toBe(2);
    }
  });

  it('returns NotFoundError when transaction does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });

  it('returns NotFoundError when new statusId does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(ok(makeTransaction({ id: 1 })));
    statusRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(1, { transactionStatusId: 999 });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });
});
