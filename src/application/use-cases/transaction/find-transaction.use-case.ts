import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '@domain/models/transaction.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';

@Injectable()
export class FindTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(id: number): Promise<Transaction> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Transaction', id);
    }
    return entity;
  }
}
