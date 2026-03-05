import { Injectable, Inject } from '@nestjs/common';
import { Delivery, CreateDeliveryDto } from '@domain/models/delivery.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ITransactionRepository } from '@application/ports/out/transaction-repository.port';

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

  async execute(dto: CreateDeliveryDto): Promise<Delivery> {
    const customer = await this.customerRepository.findById(dto.customerId);
    if (!customer) {
      throw new NotFoundException('Customer', dto.customerId);
    }
    const transaction = await this.transactionRepository.findById(dto.transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction', dto.transactionId);
    }
    const entity = Object.assign(new Delivery(), dto);
    return this.deliveryRepository.save(entity);
  }
}
