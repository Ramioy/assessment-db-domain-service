// @ts-nocheck
/* eslint-disable */
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import {
  makeMockProductRepository,
  makeMockProductCategoryRepository,
} from '../../../../helpers/mock-repositories';
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
    categoryRepo.findById.mockResolvedValue(ok(makeProductCategory({ id: 1 })));
    const saved = makeProduct(dto);
    productRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(categoryRepo.findById).toHaveBeenCalledWith(1);
    expect(productRepo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns NotFoundError when category does not exist', async () => {
    categoryRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(productRepo.save).not.toHaveBeenCalled();
  });

  it('returns error with correct message for missing category', async () => {
    categoryRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('ProductCategory with id 1 not found');
  });
});
