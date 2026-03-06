// @ts-nocheck
/* eslint-disable */
import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('DeleteProductCategoryUseCase', () => {
  let useCase: DeleteProductCategoryUseCase;
  let repo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    repo = makeMockProductCategoryRepository();
    useCase = new DeleteProductCategoryUseCase(repo);
  });

  it('deletes the category when it exists', async () => {
    repo.findById.mockResolvedValue(ok(makeProductCategory({ id: 1 })));
    repo.delete.mockResolvedValue(ok(undefined));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
  });

  it('returns NotFoundError when category does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.delete', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(ok(makeProductCategory({ id: 1 })));
    repo.delete.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
