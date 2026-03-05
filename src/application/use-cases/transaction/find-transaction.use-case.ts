import { Injectable, Inject } from '@nestjs/common';
import { Transaction } from '@domain/models/transaction.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly repository: ITransactionRepository,
  ) {}

  async execute(id: number): Promise<Result<Transaction, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Transaction', id));
    return ok(result.value);
  }
}
