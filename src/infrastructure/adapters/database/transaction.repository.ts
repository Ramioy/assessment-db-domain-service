import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '@domain/models/transaction.entity';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { TransactionOrmEntity } from '@infrastructure/persistence/entities/transaction.orm-entity';
import { TransactionMapper } from '@infrastructure/persistence/mappers/transaction.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class TransactionRepository implements TransactionRepositoryPort {
  constructor(
    @InjectRepository(TransactionOrmEntity)
    private readonly repo: Repository<TransactionOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<Transaction | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? TransactionMapper.toDomain(orm) : null));
  }

  async findByCustomerId(customerId: number): Promise<Result<Transaction[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find({ where: { customerId } }), wrapDbError);
    return map(result, (orms) => orms.map((o) => TransactionMapper.toDomain(o)));
  }

  async findAll(): Promise<Result<Transaction[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => TransactionMapper.toDomain(o)));
  }

  async save(entity: Transaction): Promise<Result<Transaction, InfrastructureError>> {
    const orm = TransactionMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => TransactionMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
