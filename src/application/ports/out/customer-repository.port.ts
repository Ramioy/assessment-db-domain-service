import type { Result } from '@shared/result';
import type { InfrastructureError } from '@shared/errors';
import { Customer } from '@domain/models/customer.entity';

export interface CustomerRepositoryPort {
  findById(id: number): Promise<Result<Customer | null, InfrastructureError>>;
  findByEmail(email: string): Promise<Result<Customer | null, InfrastructureError>>;
  findByDocumentNumber(
    documentNumber: string,
  ): Promise<Result<Customer | null, InfrastructureError>>;
  findAll(): Promise<Result<Customer[], InfrastructureError>>;
  save(entity: Customer): Promise<Result<Customer, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
