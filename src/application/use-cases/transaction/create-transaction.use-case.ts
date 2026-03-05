import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Transaction, CreateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { TransactionService } from '@domain/services/transaction.service';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { TransactionStatusRepositoryPort } from '@application/ports/out/transaction-status-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateTransactionUseCase {
  private readonly transactionService = new TransactionService();

  constructor(
    @Inject(DI_TOKENS.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(DI_TOKENS.TRANSACTION_STATUS_REPOSITORY)
    private readonly statusRepository: TransactionStatusRepositoryPort,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<Transaction, AppError>> {
    const validation = this.transactionService.validateTransactionCreation(
      dto.customerId,
      dto.transactionStatusId,
    );
    if (!validation.ok) return validation;

    const customerResult = await this.customerRepository.findById(dto.customerId);
    if (!customerResult.ok) return customerResult;
    if (!customerResult.value) {
      return err(new NotFoundError('Customer', dto.customerId));
    }

    const statusResult = await this.statusRepository.findById(dto.transactionStatusId);
    if (!statusResult.ok) return statusResult;
    if (!statusResult.value) {
      return err(new NotFoundError('TransactionStatus', dto.transactionStatusId));
    }

    const entity = Object.assign(new Transaction(), dto);
    return this.transactionRepository.save(entity);
  }
}
