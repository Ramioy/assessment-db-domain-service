import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Transaction } from '@domain/models/transaction.entity';
import { type DomainError } from '@domain/errors';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllTransactionsUseCase {
  constructor(
    @Inject(DI_TOKENS.TRANSACTION_REPOSITORY)
    private readonly repository: TransactionRepositoryPort,
  ) {}

  async execute(customerId?: number): Promise<Result<Transaction[], DomainError>> {
    if (customerId !== undefined) {
      return this.repository.findByCustomerId(customerId);
    }
    return this.repository.findAll();
  }
}
