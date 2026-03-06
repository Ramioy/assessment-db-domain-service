import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { TransactionStatusRepositoryPort } from '@application/ports/out/transaction-status-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { TransactionStatusOrmEntity } from '@infrastructure/persistence/entities/transaction-status.orm-entity';
import { TransactionStatusMapper } from '@infrastructure/persistence/mappers/transaction-status.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class TransactionStatusRepository implements TransactionStatusRepositoryPort {
  constructor(
    @InjectRepository(TransactionStatusOrmEntity)
    private readonly repo: Repository<TransactionStatusOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? TransactionStatusMapper.toDomain(orm) : null));
  }

  async findByName(name: string): Promise<Result<TransactionStatus | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { name } }), wrapDbError);
    return map(result, (orm) => (orm ? TransactionStatusMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<TransactionStatus[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => TransactionStatusMapper.toDomain(o)));
  }

  async save(entity: TransactionStatus): Promise<Result<TransactionStatus, InfrastructureError>> {
    const orm = TransactionStatusMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => TransactionStatusMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
