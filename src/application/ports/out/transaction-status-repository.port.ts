import { TransactionStatus } from '@domain/models/transaction-status.entity';

export interface ITransactionStatusRepository {
  findById(id: number): Promise<TransactionStatus | null>;
  findByName(name: string): Promise<TransactionStatus | null>;
  findAll(): Promise<TransactionStatus[]>;
  save(entity: TransactionStatus): Promise<TransactionStatus>;
  delete(id: number): Promise<boolean>;
}
