import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '@domain/models/customer.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number): Promise<Result<Customer, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Customer', id));
    return ok(result.value);
  }
}
