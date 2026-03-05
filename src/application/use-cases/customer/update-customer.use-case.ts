import { Injectable, Inject } from '@nestjs/common';
import { Customer, UpdateCustomerDto } from '@domain/models/customer.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number, dto: UpdateCustomerDto): Promise<Customer> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Customer', id);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }
}
