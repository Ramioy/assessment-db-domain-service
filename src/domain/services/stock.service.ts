import { Stock } from '@domain/models/stock.entity';
import { InsufficientStockException } from '@domain/exceptions/insufficient-stock.exception';

export class StockService {
  validateStockAvailability(stock: Stock, requestedQty: number): void {
    if (requestedQty <= 0) {
      throw new Error('Requested quantity must be greater than zero');
    }
    if (stock.quantity < requestedQty) {
      throw new InsufficientStockException(stock.productId, requestedQty, stock.quantity);
    }
  }

  decrementStock(stock: Stock, qty: number): Stock {
    this.validateStockAvailability(stock, qty);
    stock.quantity -= qty;
    return stock;
  }
}
