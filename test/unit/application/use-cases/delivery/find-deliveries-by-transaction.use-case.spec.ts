import { FindDeliveriesByTransactionUseCase } from '@application/use-cases/delivery/find-deliveries-by-transaction.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    transactionRepo.findById.mockResolvedValue(tx);
    deliveryRepo.findByTransactionId.mockResolvedValue(deliveries);

    const result = await useCase.execute(10);

    expect(transactionRepo.findById).toHaveBeenCalledWith(10);
    expect(deliveryRepo.findByTransactionId).toHaveBeenCalledWith(10);
    expect(result).toEqual(deliveries);
  });

  it('throws NotFoundException when transaction does not exist', async () => {
    transactionRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(deliveryRepo.findByTransactionId).not.toHaveBeenCalled();
  });

  it('throws with correct message', async () => {
    transactionRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow('Transaction with id 99 not found');
  });
});
