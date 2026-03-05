import { FindAllProductsUseCase } from '@application/use-cases/product/find-all-products.use-case';
import { ok } from '@shared/result';
import { makeMockProductRepository } from '../../../../helpers/mock-repositories';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('FindAllProductsUseCase', () => {
  let useCase: FindAllProductsUseCase;
  let repo: ReturnType<typeof makeMockProductRepository>;

  beforeEach(() => {
    repo = makeMockProductRepository();
    useCase = new FindAllProductsUseCase(repo);
  });

  it('returns all products when no categoryId is specified', async () => {
    const products = [makeProduct({ id: 1 }), makeProduct({ id: 2, categoryId: 2 })];
    repo.findAll.mockResolvedValue(ok(products));

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(repo.findByCategoryId).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(products);
  });

  it('returns filtered products when categoryId is specified', async () => {
    const products = [makeProduct({ id: 1, categoryId: 3 })];
    repo.findByCategoryId.mockResolvedValue(ok(products));

    const result = await useCase.execute(3);

    expect(repo.findByCategoryId).toHaveBeenCalledWith(3);
    expect(repo.findAll).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(products);
  });

  it('returns empty array when no products exist', async () => {
    repo.findAll.mockResolvedValue(ok([]));

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual([]);
  });
});
