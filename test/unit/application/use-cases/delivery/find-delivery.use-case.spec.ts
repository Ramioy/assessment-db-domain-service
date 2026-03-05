// @ts-nocheck
/* eslint-disable */
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
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
    repo.findById.mockResolvedValue(ok(delivery));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(delivery);
  });

  it('returns NotFoundError when delivery does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns error with correct message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(7);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Delivery with id 7 not found');
  });
});
