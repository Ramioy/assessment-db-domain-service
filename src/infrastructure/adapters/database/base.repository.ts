import type { Result } from '@shared/result';
import type { InfrastructureError } from '@domain/errors';

export abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<Result<T | null, InfrastructureError>>;
  abstract findAll(): Promise<Result<T[], InfrastructureError>>;
  abstract save(entity: T): Promise<Result<T, InfrastructureError>>;
  abstract delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
