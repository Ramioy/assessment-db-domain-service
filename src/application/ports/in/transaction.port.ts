import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@domain/models/transaction.entity';
import type { DomainError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface TransactionInputPort {
  create(dto: CreateTransactionDto): Promise<Result<Transaction, DomainError>>;
  findById(id: number): Promise<Result<Transaction, DomainError>>;
  findAll(customerId?: number): Promise<Result<Transaction[], DomainError>>;
  update(id: number, dto: UpdateTransactionDto): Promise<Result<Transaction, DomainError>>;
}
