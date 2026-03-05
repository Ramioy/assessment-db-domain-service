import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockProductRepository, makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProduct, makeProductCategory } from '../../../../helpers/entity-factory';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepo: ReturnType<typeof makeMockProductRepository>;
  let categoryRepo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    productRepo = makeMockProductRepository();
    categoryRepo = makeMockProductCategoryRepository();
    useCase = new CreateProductUseCase(productRepo, categoryRepo);
  });

  const dto = { name: 'Laptop', categoryId: 1, description: null, imageUrl: null };

  it('creates and returns a product when category exists', async () => {
    categoryRepo.findById.mockResolvedValue(makeProductCategory({ id: 1 }));
    const saved = makeProduct(dto);
    productRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(categoryRepo.findById).toHaveBeenCalledWith(1);
    expect(productRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('throws NotFoundException when category does not exist', async () => {
    categoryRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(productRepo.save).not.toHaveBeenCalled();
  });

  it('throws with correct message for missing category', async () => {
    categoryRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(
      'ProductCategory with id 1 not found',
    );
  });
});
