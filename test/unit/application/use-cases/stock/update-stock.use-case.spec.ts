// @ts-nocheck

import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockStockRepository } from '../../../../helpers/mock-repositories';
import { makeStock } from '../../../../helpers/entity-factory';

describe('UpdateStockUseCase', () => {
  let useCase: UpdateStockUseCase;
  let repo: ReturnType<typeof makeMockStockRepository>;

  beforeEach(() => {
    repo = makeMockStockRepository();
    useCase = new UpdateStockUseCase(repo);
  });

  it('updates and returns stock', async () => {
    const existing = makeStock({ productId: 1, quantity: 10 });
    const dto = { quantity: 25 };
    const saved = makeStock({ productId: 1, quantity: 25 });
    repo.findByProductId.mockResolvedValue(ok(existing));
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(1, dto);

    expect(repo.findByProductId).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeStock({ productId: 1, quantity: 10, description: 'Old' });
    const dto = { description: 'New' };
    repo.findByProductId.mockResolvedValue(ok(existing));
    repo.save.mockImplementation((e) => Promise.resolve(ok(e)));

    const result = await useCase.execute(1, dto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBe('New');
      expect(result.value.quantity).toBe(10);
    }
  });

  it('returns NotFoundError when stock does not exist', async () => {
    repo.findByProductId.mockResolvedValue(ok(null));

    const result = await useCase.execute(99, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.findByProductId', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findByProductId.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
