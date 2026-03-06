// @ts-nocheck

import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('FindAllProductCategoriesUseCase', () => {
  let useCase: FindAllProductCategoriesUseCase;
  let repo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    repo = makeMockProductCategoryRepository();
    useCase = new FindAllProductCategoriesUseCase(repo);
  });

  it('returns all categories from repository', async () => {
    const categories = [
      makeProductCategory({ id: 1 }),
      makeProductCategory({ id: 2, name: 'Clothing' }),
    ];
    repo.findAll.mockResolvedValue(ok(categories));

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(categories);
  });

  it('returns empty array when no categories exist', async () => {
    repo.findAll.mockResolvedValue(ok([]));

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual([]);
  });

  it('propagates infrastructure error from repo.findAll', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findAll.mockResolvedValue(err(dbError));

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
