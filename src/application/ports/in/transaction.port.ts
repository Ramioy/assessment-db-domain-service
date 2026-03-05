import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@domain/models/transaction.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface TransactionInputPort {
  create(dto: CreateTransactionDto): Promise<Result<Transaction, AppError>>;
  findById(id: number): Promise<Result<Transaction, AppError>>;
  findAll(customerId?: number): Promise<Result<Transaction[], AppError>>;
  update(id: number, dto: UpdateTransactionDto): Promise<Result<Transaction, AppError>>;
}
