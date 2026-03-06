import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Customer, UpdateCustomerDto } from '@domain/models/customer.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly repository: CustomerRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateCustomerDto): Promise<Result<Customer, AppError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Customer', id));

    const updated = findResult.value.applyUpdate(dto);
    return this.repository.save(updated);
  }
}
