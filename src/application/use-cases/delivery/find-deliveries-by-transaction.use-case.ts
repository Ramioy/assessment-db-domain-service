import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Delivery } from '@domain/models/delivery.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class FindDeliveriesByTransactionUseCase {
  constructor(
    @Inject(DI_TOKENS.DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(DI_TOKENS.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async execute(transactionId: number): Promise<Result<Delivery[], AppError>> {
    const txResult = await this.transactionRepository.findById(transactionId);
    if (!txResult.ok) return txResult;
    if (!txResult.value) {
      return err(new NotFoundError('Transaction', transactionId));
    }

    return this.deliveryRepository.findByTransactionId(transactionId);
  }
}
