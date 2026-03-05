/**
 * E2E Test Bootstrap
 * ─────────────────────────────────────────────────────────────
 * Creates a NestJS Fastify application wiring all controllers
 * and use cases directly, with all repository DI tokens resolved
 * to jest mocks. No TypeORM DataSource required.
 *
 * This tests the full HTTP layer:
 *   Fastify routing → NestJS controller → use case → mock repo
 *   plus: ZodValidationPipe, ParseIntPipe, HttpErrorFilter
 */

import { Test, TestingModule } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { HttpErrorFilter } from '@shared/filters/http-exception.filter';
import { DI_TOKENS } from '@shared/di-tokens';

// Controllers
import { ProductCategoryController } from '@presentation/controllers/product-category.controller';
import { ProductController } from '@presentation/controllers/product.controller';
import { StockController } from '@presentation/controllers/stock.controller';
import { CustomerController } from '@presentation/controllers/customer.controller';
import { TransactionController } from '@presentation/controllers/transaction.controller';
import { DeliveryController } from '@presentation/controllers/delivery.controller';
import { HealthController } from '@presentation/controllers/health.controller';

// Use cases
import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { FindAllProductsUseCase } from '@application/use-cases/product/find-all-products.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { FindAllTransactionsUseCase } from '@application/use-cases/transaction/find-all-transactions.use-case';
import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';

// Mock factories
import {
  makeMockProductCategoryRepository,
  makeMockProductRepository,
  makeMockStockRepository,
  makeMockCustomerDocumentTypeRepository,
  makeMockCustomerRepository,
  makeMockTransactionStatusRepository,
  makeMockTransactionRepository,
  makeMockDeliveryRepository,
} from '../helpers/mock-repositories';
import { getDataSourceToken } from '@nestjs/typeorm';

export interface TestRepos {
  productCategory: ReturnType<typeof makeMockProductCategoryRepository>;
  product: ReturnType<typeof makeMockProductRepository>;
  stock: ReturnType<typeof makeMockStockRepository>;
  customerDocumentType: ReturnType<typeof makeMockCustomerDocumentTypeRepository>;
  customer: ReturnType<typeof makeMockCustomerRepository>;
  transactionStatus: ReturnType<typeof makeMockTransactionStatusRepository>;
  transaction: ReturnType<typeof makeMockTransactionRepository>;
  delivery: ReturnType<typeof makeMockDeliveryRepository>;
}

export async function bootstrapTestApp(): Promise<{
  app: NestFastifyApplication;
  repos: TestRepos;
}> {
  const repos: TestRepos = {
    productCategory: makeMockProductCategoryRepository(),
    product: makeMockProductRepository(),
    stock: makeMockStockRepository(),
    customerDocumentType: makeMockCustomerDocumentTypeRepository(),
    customer: makeMockCustomerRepository(),
    transactionStatus: makeMockTransactionStatusRepository(),
    transaction: makeMockTransactionRepository(),
    delivery: makeMockDeliveryRepository(),
  };

  const mockDataSource = { query: jest.fn().mockResolvedValue([]) };

  const moduleFixture: TestingModule = await Test.createTestingModule({
    controllers: [
      ProductCategoryController,
      ProductController,
      StockController,
      CustomerController,
      TransactionController,
      DeliveryController,
      HealthController,
    ],
    providers: [
      // ── Repository mock providers ───────────────────────────────
      { provide: DI_TOKENS.PRODUCT_CATEGORY_REPOSITORY, useValue: repos.productCategory },
      { provide: DI_TOKENS.PRODUCT_REPOSITORY, useValue: repos.product },
      { provide: DI_TOKENS.STOCK_REPOSITORY, useValue: repos.stock },
      {
        provide: DI_TOKENS.CUSTOMER_DOCUMENT_TYPE_REPOSITORY,
        useValue: repos.customerDocumentType,
      },
      { provide: DI_TOKENS.CUSTOMER_REPOSITORY, useValue: repos.customer },
      { provide: DI_TOKENS.TRANSACTION_STATUS_REPOSITORY, useValue: repos.transactionStatus },
      { provide: DI_TOKENS.TRANSACTION_REPOSITORY, useValue: repos.transaction },
      { provide: DI_TOKENS.DELIVERY_REPOSITORY, useValue: repos.delivery },
      // ── DataSource mock (for HealthController @InjectDataSource) ─
      { provide: getDataSourceToken(), useValue: mockDataSource },
      // ── Use cases ────────────────────────────────────────────────
      CreateProductCategoryUseCase,
      FindProductCategoryUseCase,
      FindAllProductCategoriesUseCase,
      UpdateProductCategoryUseCase,
      DeleteProductCategoryUseCase,
      CreateProductUseCase,
      FindProductUseCase,
      FindAllProductsUseCase,
      UpdateProductUseCase,
      DeleteProductUseCase,
      FindStockByProductUseCase,
      UpdateStockUseCase,
      CreateCustomerUseCase,
      FindCustomerUseCase,
      FindAllCustomersUseCase,
      UpdateCustomerUseCase,
      DeleteCustomerUseCase,
      CreateTransactionUseCase,
      FindTransactionUseCase,
      FindAllTransactionsUseCase,
      UpdateTransactionUseCase,
      CreateDeliveryUseCase,
      FindDeliveryUseCase,
      FindAllDeliveriesUseCase,
    ],
  }).compile();

  const app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  app.useGlobalFilters(new HttpErrorFilter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return { app, repos };
}
