import { Injectable, Inject } from '@nestjs/common';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly repository: ICustomerRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Customer', id);
    }
    await this.repository.delete(id);
  }
}
