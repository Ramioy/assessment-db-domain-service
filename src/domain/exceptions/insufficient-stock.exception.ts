import { DomainException } from './domain.exception';

export class InsufficientStockException extends DomainException {
  constructor(productId: number, requested: number, available: number) {
    super(
      `Insufficient stock for product ${productId}: requested ${requested}, available ${available}`,
    );
    this.name = 'InsufficientStockException';
  }
}
