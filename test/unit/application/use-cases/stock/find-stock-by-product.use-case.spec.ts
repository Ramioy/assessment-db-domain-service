// @ts-nocheck
/* eslint-disable */
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockStockRepository } from '../../../../helpers/mock-repositories';
import { makeStock } from '../../../../helpers/entity-factory';

describe('FindStockByProductUseCase', () => {
  let useCase: FindStockByProductUseCase;
  let repo: ReturnType<typeof makeMockStockRepository>;

  beforeEach(() => {
    repo = makeMockStockRepository();
    useCase = new FindStockByProductUseCase(repo);
  });

  it('returns stock when found for the given productId', async () => {
    const stock = makeStock({ productId: 5 });
    repo.findByProductId.mockResolvedValue(ok(stock));

    const result = await useCase.execute(5);

    expect(repo.findByProductId).toHaveBeenCalledWith(5);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(stock);
  });

  it('returns NotFoundError when stock does not exist for productId', async () => {
    repo.findByProductId.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns error with correct message', async () => {
    repo.findByProductId.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Stock for product with id 99 not found');
  });

  it('propagates infrastructure error from repo.findByProductId', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findByProductId.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
