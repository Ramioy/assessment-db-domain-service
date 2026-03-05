import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@domain/models/transaction.entity';
import { InfrastructureError } from '@domain/errors';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  findById(id: number): Promise<Result<Transaction | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByCustomerId(customerId: number): Promise<Result<Transaction[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { customerId } }), wrap);
  }

  findAll(): Promise<Result<Transaction[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: Transaction): Promise<Result<Transaction, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
