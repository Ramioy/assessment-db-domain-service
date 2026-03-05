import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Customer } from '@domain/models/customer.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindCustomerUseCase {
  constructor(
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(id: number): Promise<Result<Customer, DomainError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('Customer', id));
    return ok(result.value);
  }
}
