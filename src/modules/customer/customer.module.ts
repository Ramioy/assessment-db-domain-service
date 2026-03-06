import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from '@infrastructure/persistence/entities/customer.orm-entity';
import { CustomerDocumentTypeOrmEntity } from '@infrastructure/persistence/entities/customer-document-type.orm-entity';
import { DI_TOKENS } from '@shared/di-tokens';
import { CustomerRepository } from '@infrastructure/adapters/database/customer.repository';
import { CustomerDocumentTypeRepository } from '@infrastructure/adapters/database/customer-document-type.repository';
import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { CustomerController } from '@presentation/controllers/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity, CustomerDocumentTypeOrmEntity])],
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    FindCustomerUseCase,
    FindAllCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    {
      provide: DI_TOKENS.CUSTOMER_REPOSITORY,
      useClass: CustomerRepository,
    },
    {
      provide: DI_TOKENS.CUSTOMER_DOCUMENT_TYPE_REPOSITORY,
      useClass: CustomerDocumentTypeRepository,
    },
  ],
  exports: [DI_TOKENS.CUSTOMER_REPOSITORY, DI_TOKENS.CUSTOMER_DOCUMENT_TYPE_REPOSITORY],
})
export class CustomerModule {}
