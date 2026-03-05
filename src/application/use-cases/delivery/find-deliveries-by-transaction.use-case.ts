import { Injectable, Inject } from '@nestjs/common';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class FindDeliveriesByTransactionUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(transactionId: number): Promise<Result<Delivery[], DomainError>> {
    const txResult = await this.transactionRepository.findById(transactionId);
    if (!txResult.ok) return txResult;
    if (!txResult.value) {
      return err(new NotFoundError('Transaction', transactionId));
    }

    return this.deliveryRepository.findByTransactionId(transactionId);
  }
}
