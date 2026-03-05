import { Injectable, Inject } from '@nestjs/common';
import { NotFoundError, type DomainError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number): Promise<Result<void, DomainError>> {
    const findResult = await this.repository.findById(id);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Customer', id));

    const deleteResult = await this.repository.delete(id);
    if (!deleteResult.ok) return deleteResult;

    return ok(undefined);
  }
}
