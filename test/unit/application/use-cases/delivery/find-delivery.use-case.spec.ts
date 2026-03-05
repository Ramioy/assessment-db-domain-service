import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockDeliveryRepository } from '../../../../helpers/mock-repositories';
import { makeDelivery } from '../../../../helpers/entity-factory';

describe('FindDeliveryUseCase', () => {
  let useCase: FindDeliveryUseCase;
  let repo: ReturnType<typeof makeMockDeliveryRepository>;

  beforeEach(() => {
    repo = makeMockDeliveryRepository();
    useCase = new FindDeliveryUseCase(repo);
  });

  it('returns the delivery when found', async () => {
    const delivery = makeDelivery({ id: 1 });
    repo.findById.mockResolvedValue(delivery);

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(delivery);
  });

  it('throws NotFoundException when delivery does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws with correct message', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(7)).rejects.toThrow('Delivery with id 7 not found');
  });
});
