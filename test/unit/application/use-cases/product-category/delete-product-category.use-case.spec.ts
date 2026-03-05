import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(makeProductCategory({ id: 1 }));
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('throws NotFoundException when category does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
