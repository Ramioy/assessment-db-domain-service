import { Injectable, Inject } from '@nestjs/common';
import { Customer } from '@domain/models/customer.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';

@Injectable()
export class FindCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number): Promise<Customer> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Customer', id);
    }
    return entity;
  }
}
