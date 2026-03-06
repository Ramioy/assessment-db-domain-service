import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Transaction, UpdateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { TransactionStatusRepositoryPort } from '@application/ports/out/transaction-status-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject(DI_TOKENS.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(DI_TOKENS.TRANSACTION_STATUS_REPOSITORY)
    private readonly statusRepository: TransactionStatusRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateTransactionDto): Promise<Result<Transaction, AppError>> {
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

    const updated = findResult.value.applyUpdate(dto);
    return this.transactionRepository.save(updated);
  }
}
