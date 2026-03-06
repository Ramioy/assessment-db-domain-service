// @ts-nocheck

import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { AlreadyExistsError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
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
    repo.findByName.mockResolvedValue(ok(null));
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(repo.findByName).toHaveBeenCalledWith('Electronics');
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns AlreadyExistsError when category with same name exists', async () => {
    const dto = { name: 'Electronics' };
    repo.findByName.mockResolvedValue(ok(makeProductCategory()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(AlreadyExistsError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('returns AlreadyExistsError with correct message', async () => {
    const dto = { name: 'Electronics' };
    repo.findByName.mockResolvedValue(ok(makeProductCategory()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBe("ProductCategory with name 'Electronics' already exists");
    }
  });

  it('propagates infrastructure error from repo.findByName', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findByName.mockResolvedValue(err(dbError));

    const result = await useCase.execute({ name: 'Electronics' });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
