// @ts-nocheck

import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
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
    repo.findById.mockResolvedValue(ok(makeProduct({ id: 1 })));
    repo.delete.mockResolvedValue(ok(undefined));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
  });

  it('returns NotFoundError when product does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.delete).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.delete', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(ok(makeProduct({ id: 1 })));
    repo.delete.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
