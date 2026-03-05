import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';

export interface IDeliveryInputPort {
  create(dto: CreateDeliveryDto): Promise<Delivery>;
  findById(id: number): Promise<Delivery>;
  findAll(transactionId?: number, customerId?: number): Promise<Delivery[]>;
}
