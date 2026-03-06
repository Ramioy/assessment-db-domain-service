import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTransactionOrmEntity } from '@infrastructure/persistence/entities/payment-transaction.orm-entity';
import { DI_TOKENS } from '@shared/di-tokens';
import { PaymentTransactionRepository } from '@infrastructure/adapters/database/payment-transaction.repository';
import { CreatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/create-payment-transaction.use-case';
import { FindPaymentTransactionUseCase } from '@application/use-cases/payment-transaction/find-payment-transaction.use-case';
import { FindAllPaymentTransactionsUseCase } from '@application/use-cases/payment-transaction/find-all-payment-transactions.use-case';
import { UpdatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/update-payment-transaction.use-case';
import { PaymentTransactionController } from '@presentation/controllers/payment-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTransactionOrmEntity])],
  controllers: [PaymentTransactionController],
  providers: [
    CreatePaymentTransactionUseCase,
    FindPaymentTransactionUseCase,
    FindAllPaymentTransactionsUseCase,
    UpdatePaymentTransactionUseCase,
    {
      provide: DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY,
      useClass: PaymentTransactionRepository,
    },
  ],
  exports: [DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY],
})
export class PaymentTransactionModule {}
