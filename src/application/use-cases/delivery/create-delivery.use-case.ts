import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject(DI_TOKENS.DELIVERY_REPOSITORY)
    private readonly deliveryRepository: DeliveryRepositoryPort,
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(DI_TOKENS.TRANSACTION_REPOSITORY)
    private readonly transactionRepository: TransactionRepositoryPort,
  ) {}

  async execute(dto: CreateDeliveryDto): Promise<Result<Delivery, AppError>> {
    const customerResult = await this.customerRepository.findById(dto.customerId);
    if (!customerResult.ok) return customerResult;
    if (!customerResult.value) {
      return err(new NotFoundError('Customer', dto.customerId));
    }

    const transactionResult = await this.transactionRepository.findById(dto.transactionId);
    if (!transactionResult.ok) return transactionResult;
    if (!transactionResult.value) {
      return err(new NotFoundError('Transaction', dto.transactionId));
    }

    const entity = Delivery.create(dto);
    return this.deliveryRepository.save(entity);
  }
}
