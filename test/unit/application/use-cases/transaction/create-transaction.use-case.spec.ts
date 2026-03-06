// @ts-nocheck
/* eslint-disable */
import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import {
  makeMockTransactionRepository,
  makeMockCustomerRepository,
  makeMockTransactionStatusRepository,
} from '../../../../helpers/mock-repositories';
import {
  makeCustomer,
  makeTransaction,
  makeTransactionStatus,
} from '../../../../helpers/entity-factory';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let transactionRepo: ReturnType<typeof makeMockTransactionRepository>;
  let customerRepo: ReturnType<typeof makeMockCustomerRepository>;
  let statusRepo: ReturnType<typeof makeMockTransactionStatusRepository>;

  const dto = { customerId: 1, transactionStatusId: 1, cut: null };

  beforeEach(() => {
    transactionRepo = makeMockTransactionRepository();
    customerRepo = makeMockCustomerRepository();
    statusRepo = makeMockTransactionStatusRepository();
    useCase = new CreateTransactionUseCase(transactionRepo, customerRepo, statusRepo);
  });

  it('creates and returns a transaction when all validations pass', async () => {
    customerRepo.findById.mockResolvedValue(ok(makeCustomer({ id: 1 })));
    statusRepo.findById.mockResolvedValue(ok(makeTransactionStatus({ id: 1 })));
    const saved = makeTransaction(dto);
    transactionRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(1);
    expect(statusRepo.findById).toHaveBeenCalledWith(1);
    expect(transactionRepo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns NotFoundError when customer does not exist', async () => {
    customerRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });

  it('returns NotFoundError when status does not exist', async () => {
    customerRepo.findById.mockResolvedValue(ok(makeCustomer()));
    statusRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });
});
