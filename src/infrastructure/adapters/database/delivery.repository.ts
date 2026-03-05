import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '@domain/models/delivery.entity';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class DeliveryRepository implements DeliveryRepositoryPort {
  constructor(
    @InjectRepository(Delivery)
    private readonly repo: Repository<Delivery>,
  ) {}

  findById(id: number): Promise<Result<Delivery | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByUuid(uuid: string): Promise<Result<Delivery | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { uuid } }), wrapDbError);
  }

  findByTransactionId(transactionId: number): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { transactionId } }), wrapDbError);
  }

  findByCustomerId(customerId: number): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { customerId } }), wrapDbError);
  }

  findAll(): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: Delivery): Promise<Result<Delivery, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
