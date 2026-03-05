import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';
import type { DomainError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface DeliveryInputPort {
  create(dto: CreateDeliveryDto): Promise<Result<Delivery, DomainError>>;
  findById(id: number): Promise<Result<Delivery, DomainError>>;
  findAll(transactionId?: number, customerId?: number): Promise<Result<Delivery[], DomainError>>;
}
