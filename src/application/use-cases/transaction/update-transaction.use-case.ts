import { Injectable, Inject } from '@nestjs/common';
import { Transaction, UpdateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';

@Injectable()
export class UpdateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ITransactionStatusRepository')
    private readonly statusRepository: ITransactionStatusRepository,
  ) {}

  async execute(id: number, dto: UpdateTransactionDto): Promise<Transaction> {
    const entity = await this.transactionRepository.findById(id);
    if (!entity) {
      throw new NotFoundException('Transaction', id);
    }
    if (dto.transactionStatusId !== undefined) {
      const status = await this.statusRepository.findById(dto.transactionStatusId);
      if (!status) {
        throw new NotFoundException('TransactionStatus', dto.transactionStatusId);
      }
    }
    Object.assign(entity, dto);
    return this.transactionRepository.save(entity);
  }
}
