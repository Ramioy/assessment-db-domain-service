import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@domain/models/transaction.entity';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  findById(id: number): Promise<Result<Transaction | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByCustomerId(customerId: number): Promise<Result<Transaction[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { customerId } }), wrapDbError);
  }

  findAll(): Promise<Result<Transaction[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: Transaction): Promise<Result<Transaction, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
