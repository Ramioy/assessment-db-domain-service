import { NotFoundError } from './not-found.error';
import { AlreadyExistsError } from './already-exists.error';
import { InsufficientStockError } from './insufficient-stock.error';
import { InvalidTransactionError } from './invalid-transaction.error';
import { InfrastructureError } from '@shared/errors';

export {
  NotFoundError,
  AlreadyExistsError,
  InsufficientStockError,
  InvalidTransactionError,
  InfrastructureError,
};

export type DomainError =
  | NotFoundError
  | AlreadyExistsError
  | InsufficientStockError
  | InvalidTransactionError;

export type AppError = DomainError | InfrastructureError;
