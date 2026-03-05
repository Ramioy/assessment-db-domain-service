import { Injectable, Inject } from '@nestjs/common';
import { Customer, UpdateCustomerDto } from '@domain/models/customer.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number, dto: UpdateCustomerDto): Promise<Result<Customer, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Customer', id));

    Object.assign(findResult.value, dto);
    return this.repository.save(findResult.value);
  }
}
