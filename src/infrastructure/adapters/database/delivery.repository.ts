import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '@domain/models/delivery.entity';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';

@Injectable()
export class DeliveryRepository implements IDeliveryRepository {
  constructor(
    @InjectRepository(Delivery)
    private readonly repo: Repository<Delivery>,
  ) {}

  findById(id: number): Promise<Delivery | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUuid(uuid: string): Promise<Delivery | null> {
    return this.repo.findOne({ where: { uuid } });
  }

  findByTransactionId(transactionId: number): Promise<Delivery[]> {
    return this.repo.find({ where: { transactionId } });
  }

  findByCustomerId(customerId: number): Promise<Delivery[]> {
    return this.repo.find({ where: { customerId } });
  }

  findAll(): Promise<Delivery[]> {
    return this.repo.find();
  }

  save(entity: Delivery): Promise<Delivery> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
