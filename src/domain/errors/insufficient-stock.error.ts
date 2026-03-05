export class InsufficientStockError {
  readonly code = 'INSUFFICIENT_STOCK' as const;
  readonly message: string;

  constructor(
    readonly productId: number,
    readonly requested: number,
    readonly available: number,
  ) {
    this.message = `Insufficient stock for product ${productId}: requested ${requested}, available ${available}`;
  }
}
