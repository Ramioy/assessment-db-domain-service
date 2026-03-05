import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockTransactionRepository } from '../../../../helpers/mock-repositories';
import { makeTransaction } from '../../../../helpers/entity-factory';

describe('FindTransactionUseCase', () => {
  let useCase: FindTransactionUseCase;
  let repo: ReturnType<typeof makeMockTransactionRepository>;

  beforeEach(() => {
    repo = makeMockTransactionRepository();
    useCase = new FindTransactionUseCase(repo);
  });

  it('returns the transaction when found', async () => {
    const tx = makeTransaction({ id: 1 });
    repo.findById.mockResolvedValue(tx);

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(tx);
  });

  it('throws NotFoundException when transaction does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws with correct message', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(5)).rejects.toThrow('Transaction with id 5 not found');
  });
});
