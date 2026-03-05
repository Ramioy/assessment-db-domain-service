import type { Result } from '@shared/result';
import { InfrastructureError } from '@shared/errors';

export const DB_ERROR_CODE = 'DB_QUERY_FAILED' as const;

export const wrapDbError = (e: unknown) => new InfrastructureError(DB_ERROR_CODE, e);

export abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<Result<T | null, InfrastructureError>>;
  abstract findAll(): Promise<Result<T[], InfrastructureError>>;
  abstract save(entity: T): Promise<Result<T, InfrastructureError>>;
  abstract delete(id: number): Promise<Result<boolean, InfrastructureError>>;
}
