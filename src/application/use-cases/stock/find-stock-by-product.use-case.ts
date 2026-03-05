import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Stock } from '@domain/models/stock.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { StockRepositoryPort } from '@application/ports/out/stock-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindStockByProductUseCase {
  constructor(
    @Inject(DI_TOKENS.STOCK_REPOSITORY)
    private readonly repository: StockRepositoryPort,
  ) {}

  async execute(productId: number): Promise<Result<Stock, AppError>> {
    const result = await this.repository.findByProductId(productId);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Stock for product', productId));
    return ok(result.value);
  }
}
