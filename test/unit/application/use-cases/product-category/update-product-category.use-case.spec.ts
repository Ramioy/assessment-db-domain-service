import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockProductCategoryRepository } from '../../../../helpers/mock-repositories';
import { makeProductCategory } from '../../../../helpers/entity-factory';

describe('UpdateProductCategoryUseCase', () => {
  let useCase: UpdateProductCategoryUseCase;
  let repo: ReturnType<typeof makeMockProductCategoryRepository>;

  beforeEach(() => {
    repo = makeMockProductCategoryRepository();
    useCase = new UpdateProductCategoryUseCase(repo);
  });

  it('updates and returns the category', async () => {
    const existing = makeProductCategory({ id: 1, name: 'Old Name' });
    const dto = { name: 'New Name' };
    const saved = makeProductCategory({ id: 1, name: 'New Name' });
    repo.findById.mockResolvedValue(existing);
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('merges dto fields onto the existing entity before saving', async () => {
    const existing = makeProductCategory({ id: 1, name: 'Old', description: 'Old desc' });
    const dto = { description: 'New desc' };
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (e) => e);

    const result = await useCase.execute(1, dto);

    expect(result.description).toBe('New desc');
    expect(result.name).toBe('Old');
  });

  it('throws NotFoundException when category does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, { name: 'x' })).rejects.toThrow(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
