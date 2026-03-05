import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';

@Injectable()
export class TransactionStatusRepository implements ITransactionStatusRepository {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly repo: Repository<TransactionStatus>,
  ) {}

  findById(id: number): Promise<TransactionStatus | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string): Promise<TransactionStatus | null> {
    return this.repo.findOne({ where: { name } });
  }

  findAll(): Promise<TransactionStatus[]> {
    return this.repo.find();
  }

  save(entity: TransactionStatus): Promise<TransactionStatus> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
