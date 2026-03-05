import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { InfrastructureError } from '@domain/errors';
import { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class TransactionStatusRepository implements ITransactionStatusRepository {
  constructor(
    @InjectRepository(TransactionStatus)
    private readonly repo: Repository<TransactionStatus>,
  ) {}

  findById(id: number): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByName(name: string): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { name } }), wrap);
  }

  findAll(): Promise<Result<TransactionStatus[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: TransactionStatus): Promise<Result<TransactionStatus, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
