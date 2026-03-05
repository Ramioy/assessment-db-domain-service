import { Stock, UpdateStockDto } from '@domain/models/stock.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface StockInputPort {
  findByProductId(productId: number): Promise<Result<Stock, AppError>>;
  update(productId: number, dto: UpdateStockDto): Promise<Result<Stock, AppError>>;
}
