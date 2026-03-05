export class InvalidTransactionError {
  readonly code = 'INVALID_TRANSACTION' as const;
  readonly message: string;

  constructor(readonly reason: string) {
    this.message = `Invalid transaction: ${reason}`;
  }
}
