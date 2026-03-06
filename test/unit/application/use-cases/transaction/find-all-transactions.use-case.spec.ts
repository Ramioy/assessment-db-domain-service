// @ts-nocheck
/* eslint-disable */
import { FindAllTransactionsUseCase } from '@application/use-cases/transaction/find-all-transactions.use-case';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockTransactionRepository } from '../../../../helpers/mock-repositories';
import { makeTransaction } from '../../../../helpers/entity-factory';

describe('FindAllTransactionsUseCase', () => {
  let useCase: FindAllTransactionsUseCase;
  let repo: ReturnType<typeof makeMockTransactionRepository>;

  beforeEach(() => {
    repo = makeMockTransactionRepository();
    useCase = new FindAllTransactionsUseCase(repo);
  });

  it('returns all transactions when no customerId is given', async () => {
    const txs = [makeTransaction({ id: 1 }), makeTransaction({ id: 2 })];
    repo.findAll.mockResolvedValue(ok(txs));

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(repo.findByCustomerId).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(txs);
  });

  it('returns filtered transactions when customerId is given', async () => {
    const txs = [makeTransaction({ id: 1, customerId: 3 })];
    repo.findByCustomerId.mockResolvedValue(ok(txs));

    const result = await useCase.execute(3);

    expect(repo.findByCustomerId).toHaveBeenCalledWith(3);
    expect(repo.findAll).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(txs);
  });

  it('propagates infrastructure error from repo.findAll', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findAll.mockResolvedValue(err(dbError));

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });

  it('propagates infrastructure error from repo.findByCustomerId', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findByCustomerId.mockResolvedValue(err(dbError));

    const result = await useCase.execute(3);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
