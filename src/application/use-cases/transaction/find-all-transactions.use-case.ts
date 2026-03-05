import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '@domain/models/transaction.entity';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';

@Injectable()
export class FindAllTransactionsUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(customerId?: number): Promise<Transaction[]> {
    if (customerId !== undefined) {
      return this.repository.findByCustomerId(customerId);
    }
    return this.repository.findAll();
  }
}
