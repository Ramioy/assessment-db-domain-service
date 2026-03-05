/**
 * Repository Port (Driven Port)
 * Interface that defines repository contracts
 * Implemented by the infrastructure layer
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}
