import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { TransactionStatusRepositoryPort } from '@application/ports/out/transaction-status-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@domain/errors';

@Injectable()
export class TransactionStatusRepository implements TransactionStatusRepositoryPort {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly repo: Repository<TransactionStatus>,
  ) {}

  findById(id: number): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByName(name: string): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { name } }), wrapDbError);
  }

  findAll(): Promise<Result<TransactionStatus[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: TransactionStatus): Promise<Result<TransactionStatus, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
