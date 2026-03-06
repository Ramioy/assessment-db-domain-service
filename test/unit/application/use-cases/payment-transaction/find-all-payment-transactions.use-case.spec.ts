// @ts-nocheck

import { FindAllPaymentTransactionsUseCase } from '@application/use-cases/payment-transaction/find-all-payment-transactions.use-case';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockPaymentTransactionRepository } from '../../../../helpers/mock-repositories';
import { makePaymentTransaction } from '../../../../helpers/entity-factory';

describe('FindAllPaymentTransactionsUseCase', () => {
  let useCase: FindAllPaymentTransactionsUseCase;
  let repo: ReturnType<typeof makeMockPaymentTransactionRepository>;

  beforeEach(() => {
    repo = makeMockPaymentTransactionRepository();
    useCase = new FindAllPaymentTransactionsUseCase(repo);
  });

  it('returns all payment transactions from the repository', async () => {
    const transactions = [
      makePaymentTransaction({ reference: 'ref-001' }),
      makePaymentTransaction({ reference: 'ref-002' }),
    ];
    repo.findAll.mockResolvedValue(ok(transactions));

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(transactions);
  });

  it('returns an empty array when no transactions exist', async () => {
    repo.findAll.mockResolvedValue(ok([]));

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual([]);
  });

  it('propagates infrastructure error from findAll', async () => {
    const dbError = new InfrastructureError('DB read failure');
    repo.findAll.mockResolvedValue(err(dbError));

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
