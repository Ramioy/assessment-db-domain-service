import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Stock, UpdateStockDto } from '@domain/models/stock.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { StockRepositoryPort } from '@application/ports/out/stock-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateStockUseCase {
  constructor(
    @Inject(DI_TOKENS.STOCK_REPOSITORY)
    private readonly repository: StockRepositoryPort,
  ) {}

  async execute(productId: number, dto: UpdateStockDto): Promise<Result<Stock, DomainError>> {
    const findResult = await this.repository.findByProductId(productId);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Stock for product', productId));

    Object.assign(findResult.value, dto);
    return this.repository.save(findResult.value);
  }
}
