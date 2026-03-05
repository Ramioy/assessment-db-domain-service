import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(category);

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(category);
  });

  it('throws NotFoundException when category does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException with correct message', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(
      'ProductCategory with id 99 not found',
    );
  });
});
