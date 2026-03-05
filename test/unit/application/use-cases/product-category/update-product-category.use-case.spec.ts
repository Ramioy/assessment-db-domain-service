import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
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
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('merges dto fields onto the existing entity before saving', async () => {
    const existing = makeProductCategory({ id: 1, name: 'Old', description: 'Old desc' });
    const dto = { description: 'New desc' };
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockImplementation((e) => Promise.resolve(ok(e)));

    const result = await useCase.execute(1, dto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.description).toBe('New desc');
      expect(result.value.name).toBe('Old');
    }
  });

  it('returns NotFoundError when category does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99, { name: 'x' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
