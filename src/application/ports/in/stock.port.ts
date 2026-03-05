import { Stock, UpdateStockDto } from '@domain/models/stock.entity';

export interface IStockInputPort {
  findByProductId(productId: number): Promise<Stock>;
  update(productId: number, dto: UpdateStockDto): Promise<Stock>;
}
