import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Product, UpdateProductDto } from '@domain/models/product.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_REPOSITORY)
    private readonly repository: ProductRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateProductDto): Promise<Result<Product, AppError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Product', id));

    const updated = findResult.value.applyUpdate(dto);
    return this.repository.save(updated);
  }
}
