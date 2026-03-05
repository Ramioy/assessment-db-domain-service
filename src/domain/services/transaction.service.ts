import { InvalidTransactionException } from '@domain/exceptions/invalid-transaction.exception';

export class TransactionService {
  validateTransactionCreation(customerId: number, statusId: number): void {
    if (!customerId || customerId <= 0) {
      throw new InvalidTransactionException('customer id must be a positive integer');
    }
    if (!statusId || statusId <= 0) {
      throw new InvalidTransactionException('transaction status id must be a positive integer');
    }
  }
}
