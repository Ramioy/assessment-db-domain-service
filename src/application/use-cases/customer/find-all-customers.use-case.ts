import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '@domain/models/customer.entity';
import { type DomainError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(): Promise<Result<Customer[], DomainError>> {
    return this.repository.findAll();
  }
}
