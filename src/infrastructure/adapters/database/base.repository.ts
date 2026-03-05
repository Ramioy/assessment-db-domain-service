/**
 * Base Repository - Generic repository pattern implementation
 */
export abstract class BaseRepository<T> {
  abstract findById(id: number): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: number): Promise<boolean>;
}
