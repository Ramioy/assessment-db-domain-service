import { Injectable, Inject } from '@nestjs/common';
import { Stock } from '@domain/models/stock.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IStockRepository } from '@application/ports/out/stock-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindStockByProductUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly repository: IStockRepository,
  ) {}

  async execute(productId: number): Promise<Result<Stock, DomainError>> {
    const result = await this.repository.findByProductId(productId);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Stock for product', productId));
    return ok(result.value);
  }
}
