import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { makeMockProductRepository } from '../../../../helpers/mock-repositories';
import { makeProduct } from '../../../../helpers/entity-factory';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let repo: ReturnType<typeof makeMockProductRepository>;

  beforeEach(() => {
    repo = makeMockProductRepository();
    useCase = new DeleteProductUseCase(repo);
  });

  it('deletes the product when it exists', async () => {
    repo.findById.mockResolvedValue(makeProduct({ id: 1 }));
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('throws NotFoundException when product does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
