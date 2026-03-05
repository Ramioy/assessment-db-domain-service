import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { InvalidTransactionException } from '@domain/exceptions/invalid-transaction.exception';
import {
  makeMockTransactionRepository,
  makeMockCustomerRepository,
  makeMockTransactionStatusRepository,
} from '../../../../helpers/mock-repositories';
import { makeCustomer, makeTransaction, makeTransactionStatus } from '../../../../helpers/entity-factory';

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
    customerRepo.findById.mockResolvedValue(makeCustomer({ id: 1 }));
    statusRepo.findById.mockResolvedValue(makeTransactionStatus({ id: 1 }));
    const saved = makeTransaction(dto);
    transactionRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(1);
    expect(statusRepo.findById).toHaveBeenCalledWith(1);
    expect(transactionRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('throws InvalidTransactionException when customerId is 0', async () => {
    await expect(useCase.execute({ ...dto, customerId: 0 })).rejects.toThrow(
      InvalidTransactionException,
    );
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });

  it('throws InvalidTransactionException when statusId is 0', async () => {
    await expect(
      useCase.execute({ ...dto, transactionStatusId: 0 }),
    ).rejects.toThrow(InvalidTransactionException);
  });

  it('throws NotFoundException when customer does not exist', async () => {
    customerRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when status does not exist', async () => {
    customerRepo.findById.mockResolvedValue(makeCustomer());
    statusRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(transactionRepo.save).not.toHaveBeenCalled();
  });
});
