import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '@domain/models/transaction.entity';
import { type DomainError } from '@domain/errors';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(customerId?: number): Promise<Result<Transaction[], DomainError>> {
    if (customerId !== undefined) {
      return this.repository.findByCustomerId(customerId);
    }
    return this.repository.findAll();
  }
}
