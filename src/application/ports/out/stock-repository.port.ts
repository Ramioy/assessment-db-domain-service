import { Stock } from '@domain/models/stock.entity';

export interface IStockRepository {
  findById(id: number): Promise<Stock | null>;
  findByProductId(productId: number): Promise<Stock | null>;
  findAll(): Promise<Stock[]>;
  save(entity: Stock): Promise<Stock>;
  delete(id: number): Promise<boolean>;
}
