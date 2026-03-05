import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockStockRepository } from '../../../../helpers/mock-repositories';
import { makeStock } from '../../../../helpers/entity-factory';

describe('UpdateStockUseCase', () => {
  let useCase: UpdateStockUseCase;
  let repo: ReturnType<typeof makeMockStockRepository>;

  beforeEach(() => {
    repo = makeMockStockRepository();
    useCase = new UpdateStockUseCase(repo);
  });

  it('updates and returns stock', async () => {
    const existing = makeStock({ productId: 1, quantity: 10 });
    const dto = { quantity: 25 };
    const saved = makeStock({ productId: 1, quantity: 25 });
    repo.findByProductId.mockResolvedValue(existing);
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute(1, dto);

    expect(repo.findByProductId).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeStock({ productId: 1, quantity: 10, description: 'Old' });
    const dto = { description: 'New' };
    repo.findByProductId.mockResolvedValue(existing);
    repo.save.mockImplementation(async (e) => e);

    const result = await useCase.execute(1, dto);

    expect(result.description).toBe('New');
    expect(result.quantity).toBe(10);
  });

  it('throws NotFoundException when stock does not exist', async () => {
    repo.findByProductId.mockResolvedValue(null);

    await expect(useCase.execute(99, {})).rejects.toThrow(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
