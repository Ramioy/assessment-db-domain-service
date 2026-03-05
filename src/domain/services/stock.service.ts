import { ok, err, type Result } from '@shared/result';
import { Stock } from '@domain/models/stock.entity';
import { InsufficientStockError } from '@domain/errors';

export class StockService {
  validateStockAvailability(
    stock: Stock,
    requestedQty: number,
  ): Result<void, InsufficientStockError> {
    if (requestedQty <= 0) {
      return err(new InsufficientStockError(stock.productId, requestedQty, stock.quantity));
    }
    if (stock.quantity < requestedQty) {
      return err(new InsufficientStockError(stock.productId, requestedQty, stock.quantity));
    }
    return ok(undefined);
  }

  decrementStock(stock: Stock, qty: number): Result<Stock, InsufficientStockError> {
    const validation = this.validateStockAvailability(stock, qty);
    if (!validation.ok) return validation;
    stock.quantity -= qty;
    return ok(stock);
  }
}
