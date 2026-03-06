import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { PaymentTransactionRepositoryPort } from '@application/ports/out/payment-transaction-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { PaymentTransactionOrmEntity } from '@infrastructure/persistence/entities/payment-transaction.orm-entity';
import { PaymentTransactionMapper } from '@infrastructure/persistence/mappers/payment-transaction.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class PaymentTransactionRepository implements PaymentTransactionRepositoryPort {
  constructor(
    @InjectRepository(PaymentTransactionOrmEntity)
    private readonly repo: Repository<PaymentTransactionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Result<PaymentTransaction | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? PaymentTransactionMapper.toDomain(orm) : null));
  }

  async findByReference(
    reference: string,
  ): Promise<Result<PaymentTransaction | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { reference } }), wrapDbError);
    return map(result, (orm) => (orm ? PaymentTransactionMapper.toDomain(orm) : null));
  }

  async findByProviderId(
    providerId: string,
  ): Promise<Result<PaymentTransaction | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { providerId } }), wrapDbError);
    return map(result, (orm) => (orm ? PaymentTransactionMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<PaymentTransaction[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => PaymentTransactionMapper.toDomain(o)));
  }

  async save(entity: PaymentTransaction): Promise<Result<PaymentTransaction, InfrastructureError>> {
    const orm = PaymentTransactionMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => PaymentTransactionMapper.toDomain(o));
  }
}
