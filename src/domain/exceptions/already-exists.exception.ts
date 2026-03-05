import { DomainException } from './domain.exception';

export class AlreadyExistsException extends DomainException {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} with ${field} '${value}' already exists`);
    this.name = 'AlreadyExistsException';
  }
}
