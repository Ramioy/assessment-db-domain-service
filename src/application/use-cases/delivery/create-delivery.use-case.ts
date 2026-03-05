import { Injectable, Inject } from '@nestjs/common';
import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(dto: CreateDeliveryDto): Promise<Result<Delivery, DomainError>> {
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

    const entity = Object.assign(new Delivery(), dto);
    return this.deliveryRepository.save(entity);
  }
}
