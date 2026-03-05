import { Injectable, Inject } from '@nestjs/common';
import { Product, UpdateProductDto } from '@domain/models/product.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('IProductRepository')
    private readonly repository: IProductRepository,
  ) {}

  async execute(id: number, dto: UpdateProductDto): Promise<Result<Product, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Product', id));

    Object.assign(findResult.value, dto);
    return this.repository.save(findResult.value);
  }
}
