import { Injectable, Inject } from '@nestjs/common';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number): Promise<Result<void, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Product', id));

    const deleteResult = await this.repository.delete(id);
    if (!deleteResult.ok) return deleteResult;

    return ok(undefined);
  }
}
