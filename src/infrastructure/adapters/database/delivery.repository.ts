import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '@domain/models/delivery.entity';
import { InfrastructureError } from '@domain/errors';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(
    @InjectRepository(Delivery)
    private readonly repo: Repository<Delivery>,
  ) {}

  findById(id: number): Promise<Result<Delivery | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByUuid(uuid: string): Promise<Result<Delivery | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { uuid } }), wrap);
  }

  findByTransactionId(transactionId: number): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { transactionId } }), wrap);
  }

  findByCustomerId(customerId: number): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { customerId } }), wrap);
  }

  findAll(): Promise<Result<Delivery[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: Delivery): Promise<Result<Delivery, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
