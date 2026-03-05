import { ok, err, type Result } from '@shared/result';
import { InvalidTransactionError } from '@domain/errors';

export class TransactionService {
  validateTransactionCreation(
    customerId: number,
    statusId: number,
  ): Result<void, InvalidTransactionError> {
    if (!customerId || customerId <= 0) {
      return err(new InvalidTransactionError('customer id must be a positive integer'));
    }
    if (!statusId || statusId <= 0) {
      return err(new InvalidTransactionError('transaction status id must be a positive integer'));
    }
    return ok(undefined);
  }
}
