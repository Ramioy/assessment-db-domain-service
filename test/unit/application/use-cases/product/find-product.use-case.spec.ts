// @ts-nocheck
/* eslint-disable */
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockProductRepository } from '../../../../helpers/mock-repositories';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('FindProductUseCase', () => {
  let useCase: FindProductUseCase;
  let repo: ReturnType<typeof makeMockProductRepository>;

  beforeEach(() => {
    repo = makeMockProductRepository();
    useCase = new FindProductUseCase(repo);
  });

  it('returns the product when it exists', async () => {
    const product = makeProduct({ id: 1 });
    repo.findById.mockResolvedValue(ok(product));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(product);
  });

  it('returns NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns error with correct message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Product with id 99 not found');
  });

  it('propagates infrastructure error from repo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
