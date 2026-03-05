import { Delivery } from '@domain/models/delivery.entity';

export interface IDeliveryRepository {
  findById(id: number): Promise<Delivery | null>;
  findByUuid(uuid: string): Promise<Delivery | null>;
  findByTransactionId(transactionId: number): Promise<Delivery[]>;
  findByCustomerId(customerId: number): Promise<Delivery[]>;
  findAll(): Promise<Delivery[]>;
  save(entity: Delivery): Promise<Delivery>;
  delete(id: number): Promise<boolean>;
}
