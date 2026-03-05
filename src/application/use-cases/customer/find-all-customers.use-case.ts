import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Customer } from '@domain/models/customer.entity';
import { type AppError } from '@domain/errors';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(): Promise<Result<Customer[], AppError>> {
    return this.repository.findAll();
  }
}
