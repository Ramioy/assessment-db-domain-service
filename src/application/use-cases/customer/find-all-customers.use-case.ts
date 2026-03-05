import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '@domain/models/customer.entity';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(): Promise<Customer[]> {
    return this.repository.findAll();
  }
}
