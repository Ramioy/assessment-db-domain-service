import { DomainException } from './domain.exception';

export class InvalidTransactionException extends DomainException {
  constructor(reason: string) {
    super(`Invalid transaction: ${reason}`);
    this.name = 'InvalidTransactionException';
  }
}
