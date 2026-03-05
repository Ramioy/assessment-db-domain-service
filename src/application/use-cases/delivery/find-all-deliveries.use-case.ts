import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { type DomainError } from '@domain/errors';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllDeliveriesUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly repository: IDeliveryRepository,
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
