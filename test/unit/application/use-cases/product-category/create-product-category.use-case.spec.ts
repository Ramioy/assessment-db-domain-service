import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { AlreadyExistsException } from '@domain/exceptions/already-exists.exception';
import { makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('CreateProductCategoryUseCase', () => {
  let useCase: CreateProductCategoryUseCase;
  let repo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    repo = makeMockProductCategoryRepository();
    useCase = new CreateProductCategoryUseCase(repo);
  });

  it('creates and returns a new product category when name is unique', async () => {
    const dto = { name: 'Electronics', description: 'Electronic devices' };
    const saved = makeProductCategory(dto);
    repo.findByName.mockResolvedValue(null);
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(repo.findByName).toHaveBeenCalledWith('Electronics');
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('throws AlreadyExistsException when category with same name exists', async () => {
    const dto = { name: 'Electronics' };
    repo.findByName.mockResolvedValue(makeProductCategory());

    await expect(useCase.execute(dto)).rejects.toThrow(AlreadyExistsException);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('throws AlreadyExistsException with correct message', async () => {
    const dto = { name: 'Electronics' };
    repo.findByName.mockResolvedValue(makeProductCategory());

    await expect(useCase.execute(dto)).rejects.toThrow(
      "ProductCategory with name 'Electronics' already exists",
    );
  });
});
