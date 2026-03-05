import { DomainException } from './domain.exception';

export class NotFoundException extends DomainException {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id ${id} not found`);
    this.name = 'NotFoundException';
  }
}
