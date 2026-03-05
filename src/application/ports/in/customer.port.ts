import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@domain/models/customer.entity';
import type { AppError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface CustomerInputPort {
  create(dto: CreateCustomerDto): Promise<Result<Customer, AppError>>;
  findById(id: number): Promise<Result<Customer, AppError>>;
  findAll(): Promise<Result<Customer[], AppError>>;
  update(id: number, dto: UpdateCustomerDto): Promise<Result<Customer, AppError>>;
  delete(id: number): Promise<Result<void, AppError>>;
}
