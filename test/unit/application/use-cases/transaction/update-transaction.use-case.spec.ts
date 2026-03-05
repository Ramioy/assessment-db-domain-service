import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    transactionRepo.findById.mockResolvedValue(existing);
    transactionRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(1, dto);

    expect(transactionRepo.findById).toHaveBeenCalledWith(1);
    expect(statusRepo.findById).not.toHaveBeenCalled();
    expect(transactionRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('validates statusId when provided in dto', async () => {
    const existing = makeTransaction({ id: 1 });
    const dto = { transactionStatusId: 2 };
    transactionRepo.findById.mockResolvedValue(existing);
    statusRepo.findById.mockResolvedValue(makeTransactionStatus({ id: 2, name: 'APPROVED' }));
    transactionRepo.save.mockImplementation(async (e) => e);

    const result = await useCase.execute(1, dto);

    expect(statusRepo.findById).toHaveBeenCalledWith(2);
    expect(result.transactionStatusId).toBe(2);
  });

  it('throws NotFoundException when transaction does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, {})).rejects.toThrow(NotFoundException);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when new statusId does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(makeTransaction({ id: 1 }));
    statusRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(1, { transactionStatusId: 999 })).rejects.toThrow(NotFoundException);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });
});
