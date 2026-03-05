import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Delivery } from '@domain/models/delivery.entity';
import { type DomainError } from '@domain/errors';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllDeliveriesUseCase {
  constructor(
    @Inject(DI_TOKENS.DELIVERY_REPOSITORY)
    private readonly repository: DeliveryRepositoryPort,
  ) {}

  async execute(
    transactionId?: number,
    customerId?: number,
  ): Promise<Result<Delivery[], DomainError>> {
    if (transactionId !== undefined) {
      return this.repository.findByTransactionId(transactionId);
    }
    if (customerId !== undefined) {
      return this.repository.findByCustomerId(customerId);
    }
    return this.repository.findAll();
  }
}
