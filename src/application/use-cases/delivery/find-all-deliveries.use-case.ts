import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';

@Injectable()
export class FindAllDeliveriesUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly repository: IDeliveryRepository,
  ) {}

  async execute(transactionId?: number, customerId?: number): Promise<Delivery[]> {
    if (transactionId !== undefined) {
      return this.repository.findByTransactionId(transactionId);
    }
    if (customerId !== undefined) {
      return this.repository.findByCustomerId(customerId);
    }
    return this.repository.findAll();
  }
}
