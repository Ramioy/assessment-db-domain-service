import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@domain/models/customer.entity';
import type { DomainError } from '@domain/errors';
import type { Result } from '@shared/result';

export interface CustomerInputPort {
  create(dto: CreateCustomerDto): Promise<Result<Customer, DomainError>>;
  findById(id: number): Promise<Result<Customer, DomainError>>;
  findAll(): Promise<Result<Customer[], DomainError>>;
  update(id: number, dto: UpdateCustomerDto): Promise<Result<Customer, DomainError>>;
  delete(id: number): Promise<Result<void, DomainError>>;
}
