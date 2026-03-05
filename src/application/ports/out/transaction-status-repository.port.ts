import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';
import { TransactionStatus } from '@domain/models/transaction-status.entity';

export interface ITransactionStatusRepository {
  findById(id: number): Promise<Result<TransactionStatus | null, InfrastructureError>>;
  findByName(name: string): Promise<Result<TransactionStatus | null, InfrastructureError>>;
  findAll(): Promise<Result<TransactionStatus[], InfrastructureError>>;
  save(entity: TransactionStatus): Promise<Result<TransactionStatus, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
