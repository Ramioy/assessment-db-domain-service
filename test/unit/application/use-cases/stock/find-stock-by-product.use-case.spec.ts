import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockStockRepository } from '../../../../helpers/mock-repositories';
import { makeStock } from '../../../../helpers/entity-factory';

describe('FindStockByProductUseCase', () => {
  let useCase: FindStockByProductUseCase;
  let repo: ReturnType<typeof makeMockStockRepository>;

  beforeEach(() => {
    repo = makeMockStockRepository();
    useCase = new FindStockByProductUseCase(repo);
  });

  it('returns stock when found for the given productId', async () => {
    const stock = makeStock({ productId: 5 });
    repo.findByProductId.mockResolvedValue(stock);

    const result = await useCase.execute(5);

    expect(repo.findByProductId).toHaveBeenCalledWith(5);
    expect(result).toBe(stock);
  });

  it('throws NotFoundException when stock does not exist for productId', async () => {
    repo.findByProductId.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws with correct message', async () => {
    repo.findByProductId.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(
      'Stock for product with id 99 not found',
    );
  });
});
