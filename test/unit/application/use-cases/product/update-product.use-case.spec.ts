// @ts-nocheck
/* eslint-disable */
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import { makeMockProductRepository } from '../../../../helpers/mock-repositories';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let repo: ReturnType<typeof makeMockProductRepository>;

  beforeEach(() => {
    repo = makeMockProductRepository();
    useCase = new UpdateProductUseCase(repo);
  });

  it('updates and returns the product', async () => {
    const existing = makeProduct({ id: 1, name: 'Old Name' });
    const dto = { name: 'New Name' };
    const saved = makeProduct({ id: 1, name: 'New Name' });
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeProduct({ id: 1, name: 'Old', description: 'Old desc' });
    const dto = { description: 'New desc' };
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockImplementation((e) => Promise.resolve(ok(e)));

    const result = await useCase.execute(1, dto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe('Old');
      expect(result.value.description).toBe('New desc');
    }
  });

  it('returns NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
