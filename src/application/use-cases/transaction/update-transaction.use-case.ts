import { Injectable, Inject } from '@nestjs/common';
import { Transaction, UpdateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ITransactionStatusRepository')
    private readonly statusRepository: ITransactionStatusRepository,
  ) {}

  async execute(id: number, dto: UpdateTransactionDto): Promise<Result<Transaction, DomainError>> {
    const findResult = await this.transactionRepository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Transaction', id));

    if (dto.transactionStatusId !== undefined) {
      const statusResult = await this.statusRepository.findById(dto.transactionStatusId);
      if (!statusResult.ok) return statusResult;
      if (!statusResult.value) {
        return err(new NotFoundError('TransactionStatus', dto.transactionStatusId));
      }
    }

    Object.assign(findResult.value, dto);
    return this.transactionRepository.save(findResult.value);
  }
}
