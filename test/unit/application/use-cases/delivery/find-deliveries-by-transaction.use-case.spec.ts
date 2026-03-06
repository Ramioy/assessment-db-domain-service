// @ts-nocheck
/* eslint-disable */
import { FindDeliveriesByTransactionUseCase } from '@application/use-cases/delivery/find-deliveries-by-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import {
  makeMockDeliveryRepository,
  makeMockTransactionRepository,
} from '../../../../helpers/mock-repositories';
import { makeDelivery, makeTransaction } from '../../../../helpers/entity-factory';

describe('FindDeliveriesByTransactionUseCase', () => {
  let useCase: FindDeliveriesByTransactionUseCase;
  let deliveryRepo: ReturnType<typeof makeMockDeliveryRepository>;
  let transactionRepo: ReturnType<typeof makeMockTransactionRepository>;

  beforeEach(() => {
    deliveryRepo = makeMockDeliveryRepository();
    transactionRepo = makeMockTransactionRepository();
    useCase = new FindDeliveriesByTransactionUseCase(deliveryRepo, transactionRepo);
  });

  it('returns deliveries for the given transaction', async () => {
    const tx = makeTransaction({ id: 10 });
    const deliveries = [makeDelivery({ id: 1, transactionId: 10 })];
    transactionRepo.findById.mockResolvedValue(ok(tx));
    deliveryRepo.findByTransactionId.mockResolvedValue(ok(deliveries));

    const result = await useCase.execute(10);

    expect(transactionRepo.findById).toHaveBeenCalledWith(10);
    expect(deliveryRepo.findByTransactionId).toHaveBeenCalledWith(10);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(deliveries);
  });

  it('returns NotFoundError when transaction does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(deliveryRepo.findByTransactionId).not.toHaveBeenCalled();
  });

  it('returns error with correct message', async () => {
    transactionRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Transaction with id 99 not found');
  });

  it('propagates infrastructure error from transactionRepo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    transactionRepo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(10);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(deliveryRepo.findByTransactionId).not.toHaveBeenCalled();
  });
});
