import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';

export interface RepositoryPort<T> {
  findById(id: number): Promise<Result<T | null, InfrastructureError>>;
  findAll(): Promise<Result<T[], InfrastructureError>>;
  save(entity: T): Promise<Result<T, InfrastructureError>>;
  delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
