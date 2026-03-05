// @ts-nocheck
/* eslint-disable */
import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import { makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('FindProductCategoryUseCase', () => {
  let useCase: FindProductCategoryUseCase;
  let repo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    repo = makeMockProductCategoryRepository();
    useCase = new FindProductCategoryUseCase(repo);
  });

  it('returns the category when it exists', async () => {
    const category = makeProductCategory({ id: 1 });
    repo.findById.mockResolvedValue(ok(category));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(category);
  });

  it('returns NotFoundError when category does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns NotFoundError with correct message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('ProductCategory with id 99 not found');
  });
});
