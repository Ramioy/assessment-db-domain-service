import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@domain/models/transaction.entity';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  findById(id: number): Promise<Transaction | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByCustomerId(customerId: number): Promise<Transaction[]> {
    return this.repo.find({ where: { customerId } });
  }

  findAll(): Promise<Transaction[]> {
    return this.repo.find();
  }

  save(entity: Transaction): Promise<Transaction> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
