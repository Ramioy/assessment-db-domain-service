import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from '@domain/models/delivery.entity';
import { DI_TOKENS } from '@infrastructure/config/di-tokens';
import { DeliveryRepository } from '@infrastructure/adapters/database/delivery.repository';
import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';
import { FindDeliveriesByTransactionUseCase } from '@application/use-cases/delivery/find-deliveries-by-transaction.use-case';
import { DeliveryController } from '@presentation/controllers/delivery.controller';
import { CustomerModule } from '../customer/customer.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery]),
    // CreateDeliveryUseCase validates customer via ICustomerRepository
    CustomerModule,
    // CreateDeliveryUseCase + FindDeliveriesByTransactionUseCase use ITransactionRepository
    TransactionModule,
  ],
  controllers: [DeliveryController],
  providers: [
    CreateDeliveryUseCase,
    FindDeliveryUseCase,
    FindAllDeliveriesUseCase,
    FindDeliveriesByTransactionUseCase,
    {
      provide: DI_TOKENS.DELIVERY_REPOSITORY,
      useClass: DeliveryRepository,
    },
  ],
  exports: [DI_TOKENS.DELIVERY_REPOSITORY],
})
export class DeliveryModule {}
