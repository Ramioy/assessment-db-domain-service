import { Injectable, Inject } from '@nestjs/common';
import { Product } from '@domain/models/product.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number): Promise<Result<Product, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Product', id));
    return ok(result.value);
  }
}
