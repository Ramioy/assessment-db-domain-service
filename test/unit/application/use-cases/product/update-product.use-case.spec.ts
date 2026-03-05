import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(existing);
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeProduct({ id: 1, name: 'Old', description: 'Old desc' });
    const dto = { description: 'New desc' };
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (e) => e);

    const result = await useCase.execute(1, dto);

    expect(result.name).toBe('Old');
    expect(result.description).toBe('New desc');
  });

  it('throws NotFoundException when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, {})).rejects.toThrow(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
