import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';
import { Transaction } from '@domain/models/transaction.entity';

export interface TransactionRepositoryPort {
  findById(id: number): Promise<Result<Transaction | null, InfrastructureError>>;
  findByCustomerId(customerId: number): Promise<Result<Transaction[], InfrastructureError>>;
  findAll(): Promise<Result<Transaction[], InfrastructureError>>;
  save(entity: Transaction): Promise<Result<Transaction, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
