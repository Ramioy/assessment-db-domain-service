import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '@domain/models/transaction.entity';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { DI_TOKENS } from '@infrastructure/config/di-tokens';
import { TransactionRepository } from '@infrastructure/adapters/database/transaction.repository';
import { TransactionStatusRepository } from '@infrastructure/adapters/database/transaction-status.repository';
import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { FindAllTransactionsUseCase } from '@application/use-cases/transaction/find-all-transactions.use-case';
import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { TransactionController } from '@presentation/controllers/transaction.controller';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionStatus]),
    // CreateTransactionUseCase validates customer existence via ICustomerRepository
    CustomerModule,
  ],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    FindTransactionUseCase,
    FindAllTransactionsUseCase,
    UpdateTransactionUseCase,
    {
      provide: DI_TOKENS.TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
    {
      provide: DI_TOKENS.TRANSACTION_STATUS_REPOSITORY,
      useClass: TransactionStatusRepository,
    },
  ],
  exports: [DI_TOKENS.TRANSACTION_REPOSITORY, DI_TOKENS.TRANSACTION_STATUS_REPOSITORY],
})
export class TransactionModule {}
