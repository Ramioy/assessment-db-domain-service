import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';
import { Stock } from '@domain/models/stock.entity';

export interface StockRepositoryPort {
  findById(id: number): Promise<Result<Stock | null, InfrastructureError>>;
  findByProductId(productId: number): Promise<Result<Stock | null, InfrastructureError>>;
  findAll(): Promise<Result<Stock[], InfrastructureError>>;
  save(entity: Stock): Promise<Result<Stock, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
