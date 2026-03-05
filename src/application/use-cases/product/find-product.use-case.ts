import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Product } from '@domain/models/product.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindProductUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(id: number): Promise<Result<Product, AppError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Product', id));
    return ok(result.value);
  }
}
