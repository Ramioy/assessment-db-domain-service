import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface DeliveryInputPort {
  create(dto: CreateDeliveryDto): Promise<Result<Delivery, AppError>>;
  findById(id: number): Promise<Result<Delivery, AppError>>;
  findAll(transactionId?: number, customerId?: number): Promise<Result<Delivery[], AppError>>;
}
