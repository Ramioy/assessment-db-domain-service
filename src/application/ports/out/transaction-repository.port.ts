import { Transaction } from '@domain/models/transaction.entity';

export interface ITransactionRepository {
  findById(id: number): Promise<Transaction | null>;
  findByCustomerId(customerId: number): Promise<Transaction[]>;
  findAll(): Promise<Transaction[]>;
  save(entity: Transaction): Promise<Transaction>;
  delete(id: number): Promise<boolean>;
}
