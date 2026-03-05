import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
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
    const categories = [makeProductCategory({ id: 1 }), makeProductCategory({ id: 2, name: 'Clothing' })];
    repo.findAll.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });

  it('returns empty array when no categories exist', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
