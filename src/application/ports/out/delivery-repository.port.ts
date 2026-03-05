import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';
import { Delivery } from '@domain/models/delivery.entity';

export interface DeliveryRepositoryPort {
  findById(id: number): Promise<Result<Delivery | null, InfrastructureError>>;
  findByUuid(uuid: string): Promise<Result<Delivery | null, InfrastructureError>>;
  findByTransactionId(transactionId: number): Promise<Result<Delivery[], InfrastructureError>>;
  findByCustomerId(customerId: number): Promise<Result<Delivery[], InfrastructureError>>;
  findAll(): Promise<Result<Delivery[], InfrastructureError>>;
  save(entity: Delivery): Promise<Result<Delivery, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
