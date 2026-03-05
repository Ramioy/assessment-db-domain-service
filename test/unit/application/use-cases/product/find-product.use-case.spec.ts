import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockProductRepository } from '../../../../helpers/mock-repositories';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('FindProductUseCase', () => {
  let useCase: FindProductUseCase;
  let repo: ReturnType<typeof makeMockProductRepository>;

  beforeEach(() => {
    repo = makeMockProductRepository();
    useCase = new FindProductUseCase(repo);
  });

  it('returns the product when it exists', async () => {
    const product = makeProduct({ id: 1 });
    repo.findById.mockResolvedValue(product);

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(product);
  });

  it('throws NotFoundException when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws with correct message', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow('Product with id 99 not found');
  });
});
