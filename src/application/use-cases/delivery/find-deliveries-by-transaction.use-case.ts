import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';

@Injectable()
export class FindDeliveriesByTransactionUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(transactionId: number): Promise<Delivery[]> {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction', transactionId);
    }
    return this.deliveryRepository.findByTransactionId(transactionId);
  }
}
