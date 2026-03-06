import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '@domain/models/delivery.entity';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { DeliveryOrmEntity } from '@infrastructure/persistence/entities/delivery.orm-entity';
import { DeliveryMapper } from '@infrastructure/persistence/mappers/delivery.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(DeliveryOrmEntity)
    private readonly repo: Repository<DeliveryOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<Delivery | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? DeliveryMapper.toDomain(orm) : null));
  }

  async findByUuid(uuid: string): Promise<Result<Delivery | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { uuid } }), wrapDbError);
    return map(result, (orm) => (orm ? DeliveryMapper.toDomain(orm) : null));
  }

  async findByTransactionId(
    transactionId: number,
  ): Promise<Result<Delivery[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find({ where: { transactionId } }), wrapDbError);
    return map(result, (orms) => orms.map((o) => DeliveryMapper.toDomain(o)));
  }

  async findByCustomerId(customerId: number): Promise<Result<Delivery[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find({ where: { customerId } }), wrapDbError);
    return map(result, (orms) => orms.map((o) => DeliveryMapper.toDomain(o)));
  }

  async findAll(): Promise<Result<Delivery[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => DeliveryMapper.toDomain(o)));
  }

  async save(entity: Delivery): Promise<Result<Delivery, InfrastructureError>> {
    const orm = DeliveryMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => DeliveryMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
