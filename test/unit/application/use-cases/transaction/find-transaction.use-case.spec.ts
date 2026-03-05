// @ts-nocheck
/* eslint-disable */
import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
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
    repo.findById.mockResolvedValue(ok(tx));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(tx);
  });

  it('returns NotFoundError when transaction does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns error with correct message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(5);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Transaction with id 5 not found');
  });
});
