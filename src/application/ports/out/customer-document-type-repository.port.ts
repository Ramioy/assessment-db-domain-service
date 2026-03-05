import type { Result } from '@shared/result';
import type { InfrastructureError } from '@shared/errors';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';

export interface CustomerDocumentTypeRepositoryPort {
  findById(id: number): Promise<Result<CustomerDocumentType | null, InfrastructureError>>;
  findAll(): Promise<Result<CustomerDocumentType[], InfrastructureError>>;
  save(entity: CustomerDocumentType): Promise<Result<CustomerDocumentType, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
