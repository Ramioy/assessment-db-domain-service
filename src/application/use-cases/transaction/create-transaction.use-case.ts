import { Injectable, Inject } from '@nestjs/common';
import { Transaction, CreateTransactionDto } from '@domain/models/transaction.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { TransactionService } from '@domain/services/transaction.service';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';

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

  async execute(dto: CreateTransactionDto): Promise<Transaction> {
    this.transactionService.validateTransactionCreation(dto.customerId, dto.transactionStatusId);

    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new NotFoundException('Customer', dto.customerId);
    }
    const status = await this.statusRepository.findById(dto.transactionStatusId);
    if (!status) {
      throw new NotFoundException('TransactionStatus', dto.transactionStatusId);
    }
    const entity = Object.assign(new Transaction(), dto);
    return this.transactionRepository.save(entity);
  }
}
