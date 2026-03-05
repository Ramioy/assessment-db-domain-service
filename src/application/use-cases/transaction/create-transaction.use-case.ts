import { Injectable, Inject } from '@nestjs/common';
import { Transaction, CreateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { TransactionService } from '@domain/services/transaction.service';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateTransactionUseCase {
  private readonly transactionService = new TransactionService();

  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('ITransactionStatusRepository')
    private readonly statusRepository: ITransactionStatusRepository,
  ) {}

  async execute(dto: CreateTransactionDto): Promise<Result<Transaction, DomainError>> {
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
