import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';
import { makeMockDeliveryRepository } from '../../../../helpers/mock-repositories';
import { makeDelivery } from '../../../../helpers/entity-factory';

describe('FindAllDeliveriesUseCase', () => {
  let useCase: FindAllDeliveriesUseCase;
  let repo: ReturnType<typeof makeMockDeliveryRepository>;

  beforeEach(() => {
    repo = makeMockDeliveryRepository();
    useCase = new FindAllDeliveriesUseCase(repo);
  });

  it('returns all deliveries when no filters are given', async () => {
    const deliveries = [makeDelivery({ id: 1 }), makeDelivery({ id: 2 })];
    repo.findAll.mockResolvedValue(deliveries);

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(repo.findByTransactionId).not.toHaveBeenCalled();
    expect(repo.findByCustomerId).not.toHaveBeenCalled();
    expect(result).toEqual(deliveries);
  });

  it('filters by transactionId when provided (takes priority over customerId)', async () => {
    const deliveries = [makeDelivery({ id: 1, transactionId: 5 })];
    repo.findByTransactionId.mockResolvedValue(deliveries);

    const result = await useCase.execute(5, 2);

    expect(repo.findByTransactionId).toHaveBeenCalledWith(5);
    expect(repo.findByCustomerId).not.toHaveBeenCalled();
    expect(result).toEqual(deliveries);
  });

  it('filters by customerId when transactionId is not provided', async () => {
    const deliveries = [makeDelivery({ id: 1, customerId: 3 })];
    repo.findByCustomerId.mockResolvedValue(deliveries);

    const result = await useCase.execute(undefined, 3);

    expect(repo.findByCustomerId).toHaveBeenCalledWith(3);
    expect(repo.findAll).not.toHaveBeenCalled();
    expect(result).toEqual(deliveries);
  });
});
