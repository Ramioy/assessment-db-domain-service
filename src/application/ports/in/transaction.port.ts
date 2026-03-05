import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '@domain/models/transaction.entity';

export interface ITransactionInputPort {
  create(dto: CreateTransactionDto): Promise<Transaction>;
  findById(id: number): Promise<Transaction>;
  findAll(customerId?: number): Promise<Transaction[]>;
  update(id: number, dto: UpdateTransactionDto): Promise<Transaction>;
}
