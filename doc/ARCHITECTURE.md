# Hexagonal Architecture Documentation

Complete architectural guide for the Database PG Domain Service project.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Layer Breakdown](#layer-breakdown)
4. [Boilerplate Templates](#boilerplate-templates)
5. [Real-World Examples](#real-world-examples)
6. [Testing Strategy](#testing-strategy)
7. [Best Practices](#best-practices)

---

## Overview

This project implements **Hexagonal Architecture** (also known as **Ports & Adapters** or **Clean Architecture**) using NestJS with Fastify.

### Core Principles

- **Independence of Framework**: Business logic is independent of NestJS
- **Testability**: Domain and application layers can be tested without the framework
- **Flexibility**: Easy to swap implementations (database, external services)
- **Maintainability**: Clear separation of concerns
- **Scalability**: Well-defined boundaries for new features

---

## Architecture Diagram

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                     │
│         (HTTP Controllers, Pipes, Guards, Filters)          │
│  - CustomerController        - ProductController            │
│  - TransactionController     - DeliveryController           │
│  - ProductCategoryController - StockController              │
│  - HealthController          - ZodValidationPipe            │
└──────────────────────┬──────────────────────────────────────┘
                       │ (depends on)
┌──────────────────────▼──────────────────────────────────────┐
│                      APPLICATION LAYER                      │
│            (Use Cases, Orchestration, Workflows)            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  CreateCustomerUseCase    FindCustomerUseCase         │  │
│  │  CreateProductUseCase     FindAllProductsUseCase      │  │
│  │  CreateTransactionUseCase UpdateTransactionUseCase    │  │
│  │  CreateDeliveryUseCase    FindAllDeliveriesUseCase    │  │
│  │  UpdateStockUseCase       FindStockByProductUseCase   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   PORTS (Interfaces)                  │  │
│  │  ┌──────────────────────┐   ┌──────────────────────┐  │  │
│  │  │ Driving Ports        │   │ Driven Ports         │  │  │
│  │  │ (Input)              │   │ (Output)             │  │  │
│  │  │ - Commands           │   │ - ICustomerRepo      │  │  │
│  │  │ - Queries            │   │ - IProductRepo       │  │  │
│  │  │ - Events             │   │ - ITransactionRepo   │  │  │
│  │  └──────────────────────┘   └──────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ (depends on)
┌──────────────────────▼──────────────────────────────────────┐
│                        DOMAIN LAYER                         │
│          (Business Rules, Entities, Domain Errors)          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Customer (Entity)       Product (Entity)             │  │
│  │  ProductCategory (Entity) Stock (Entity)              │  │
│  │  Transaction (Entity)    TransactionStatus (Entity)   │  │
│  │  Delivery (Entity)       CustomerDocumentType (Entity)│  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  NotFoundError            AlreadyExistsError          │  │
│  │  InsufficientStockError   InvalidTransactionError     │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ (NO DEPENDENCIES - PURE LOGIC)
       ┌───────────────┴───────────────┐
       │                               │
┌──────▼────────────┐ ┌────────────────▼───┐
│ INFRASTRUCTURE    │ │ SHARED UTILITIES   │
│ (Driven Adapters) │ │                    │
├───────────────────┤ ├────────────────────┤
│ Database:         │ │ - BaseEntity       │
│ - CustomerRepo    │ │ - Result<T,E>      │
│ - ProductRepo     │ │ - LoggingIntercept │
│ - TransactionRepo │ │ - HttpErrorFilter  │
│ - DeliveryRepo    │ │ - ApiKeyGuard      │
│ - StockRepo       │ │ - DI tokens        │
│                   │ │                    │
│ Persistence:      │ └────────────────────┘
│ - ORM Entities    │
│ - Mappers         │
│                   │
│ Config:           │
│ - database.config │
│ - env.validation  │
│ - data-source     │
│ - seeds           │
└───────────────────┘

                      ▲
                      │
               Dependency Flow
            (Points Inward Only)
```

---

## Layer Breakdown

### 1. Domain Layer (`src/domain/`)

**Responsibility**: Pure business logic independent of frameworks

#### Structure

```
src/domain/
├── models/                      # Domain Entities
│   ├── customer.entity.ts
│   ├── customer-document-type.entity.ts
│   ├── product.entity.ts
│   ├── product-category.entity.ts
│   ├── stock.entity.ts
│   ├── transaction.entity.ts
│   ├── transaction-status.entity.ts
│   ├── delivery.entity.ts
│   └── index.ts
│
├── errors/                      # Domain-specific errors
│   ├── not-found.error.ts
│   ├── already-exists.error.ts
│   ├── insufficient-stock.error.ts
│   ├── invalid-transaction.error.ts
│   └── index.ts
│
└── services/                    # Domain services (pure business logic)
    └── index.ts
```

#### Key Characteristics

- ✅ **Zero External Dependencies**: No NestJS, no database, no HTTP libraries
- ✅ **Business Rules Only**: Validation, calculations, state transitions
- ✅ **Immutability**: Entities expose `applyUpdate()` / `fromPersistence()` / `create()` factory methods
- ✅ **Zod Schemas co-located**: Each entity file contains its own Zod schema and inferred types
- ✅ **Result type**: Operations return `Result<T, E>` — no thrown exceptions in use cases

#### Anti-Patterns

- ❌ Importing from Application, Infrastructure, or Presentation
- ❌ Using NestJS decorators or features
- ❌ Database operations (ORM calls)
- ❌ HTTP requests or external service calls
- ❌ Framework-specific error handling

---

### 2. Application Layer (`src/application/`)

**Responsibility**: Orchestrate domain logic and define contracts

#### Structure

```
src/application/
├── ports/
│   ├── in/                                  # Driving Ports (Input)
│   │   ├── customer.port.ts
│   │   ├── product.port.ts
│   │   ├── product-category.port.ts
│   │   ├── stock.port.ts
│   │   ├── transaction.port.ts
│   │   ├── delivery.port.ts
│   │   └── index.ts
│   │
│   └── out/                                 # Driven Ports (Output)
│       ├── repository.port.ts              # Base repository interface
│       ├── customer-repository.port.ts
│       ├── customer-document-type-repository.port.ts
│       ├── product-repository.port.ts
│       ├── product-category-repository.port.ts
│       ├── stock-repository.port.ts
│       ├── transaction-repository.port.ts
│       ├── transaction-status-repository.port.ts
│       ├── delivery-repository.port.ts
│       └── index.ts
│
├── use-cases/
│   ├── customer/
│   │   ├── create-customer.use-case.ts
│   │   ├── find-customer.use-case.ts
│   │   ├── find-all-customers.use-case.ts
│   │   ├── update-customer.use-case.ts
│   │   ├── delete-customer.use-case.ts
│   │   └── index.ts
│   │
│   ├── product/
│   │   ├── create-product.use-case.ts
│   │   ├── find-product.use-case.ts
│   │   ├── find-all-products.use-case.ts
│   │   ├── update-product.use-case.ts
│   │   ├── delete-product.use-case.ts
│   │   └── index.ts
│   │
│   ├── product-category/
│   │   ├── create-product-category.use-case.ts
│   │   ├── find-product-category.use-case.ts
│   │   ├── find-all-product-categories.use-case.ts
│   │   ├── update-product-category.use-case.ts
│   │   ├── delete-product-category.use-case.ts
│   │   └── index.ts
│   │
│   ├── stock/
│   │   ├── find-stock-by-product.use-case.ts
│   │   ├── update-stock.use-case.ts
│   │   └── index.ts
│   │
│   ├── transaction/
│   │   ├── create-transaction.use-case.ts
│   │   ├── find-transaction.use-case.ts
│   │   ├── find-all-transactions.use-case.ts
│   │   ├── update-transaction.use-case.ts
│   │   └── index.ts
│   │
│   ├── delivery/
│   │   ├── create-delivery.use-case.ts
│   │   ├── find-delivery.use-case.ts
│   │   ├── find-all-deliveries.use-case.ts
│   │   ├── find-deliveries-by-transaction.use-case.ts
│   │   └── index.ts
│   │
│   └── index.ts
```

#### Key Characteristics

- ✅ **Use Case Per Feature**: One use case = one user story
- ✅ **Depends on Ports**: Not concrete implementations
- ✅ **Orchestrates Domain**: Coordinates entities and repositories
- ✅ **Result pattern**: Returns `Result<T, DomainError>` instead of throwing
- ✅ **No framework code**: Plain TypeScript classes with NestJS `@Injectable()` only

#### Port Types

**Driving Ports** (How external actors use the app):
- Commands: Actions that change state (Create, Update, Delete)
- Queries: Read-only operations (Find, FindAll)

**Driven Ports** (How the app uses external systems):
- Repository: Data persistence (TypeORM via Infrastructure adapters)

---

### 3. Infrastructure Layer (`src/infrastructure/`)

**Responsibility**: Implement technical details and database integrations

#### Structure

```
src/infrastructure/
├── adapters/
│   ├── database/                           # TypeORM repository adapters
│   │   ├── base.repository.ts
│   │   ├── customer.repository.ts
│   │   ├── customer-document-type.repository.ts
│   │   ├── product.repository.ts
│   │   ├── product-category.repository.ts
│   │   ├── stock.repository.ts
│   │   ├── transaction.repository.ts
│   │   ├── transaction-status.repository.ts
│   │   ├── delivery.repository.ts
│   │   └── index.ts
│   │
│   └── external/                           # External service adapters (reserved)
│       └── index.ts
│
├── config/
│   ├── database.config.ts                  # TypeORM async configuration
│   ├── data-source.ts                      # TypeORM DataSource (migrations/seeds)
│   ├── env.validation.ts                   # Joi environment schema validation
│   ├── index.ts
│   └── seeds/
│       └── initial-seed.ts                 # Seed: transaction statuses, document types
│
└── persistence/
    ├── entities/                           # TypeORM ORM entities
    │   ├── customer.orm-entity.ts
    │   ├── customer-document-type.orm-entity.ts
    │   ├── product.orm-entity.ts
    │   ├── product-category.orm-entity.ts
    │   ├── stock.orm-entity.ts
    │   ├── transaction.orm-entity.ts
    │   ├── transaction-status.orm-entity.ts
    │   ├── delivery.orm-entity.ts
    │   └── index.ts
    │
    └── mappers/                            # ORM entity <-> Domain entity mappers
        ├── customer.mapper.ts
        ├── customer-document-type.mapper.ts
        ├── product.mapper.ts
        ├── product-category.mapper.ts
        ├── stock.mapper.ts
        ├── transaction.mapper.ts
        ├── transaction-status.mapper.ts
        └── delivery.mapper.ts
```

#### Key Characteristics

- ✅ **Adapts Ports**: Implements application driven-port interfaces
- ✅ **Framework Integration**: NestJS + TypeORM dependency injection
- ✅ **Mapper pattern**: Explicit `toDomain()` / `toPersistence()` conversion at boundaries
- ✅ **Swappable**: Can replace TypeORM with any other ORM without touching domain or application layers

#### Adapter Pattern

```typescript
// Driven Port (Application Layer)
export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  delete(id: number): Promise<void>;
}

// Adapter (Infrastructure Layer)
@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: number): Promise<Customer | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? CustomerMapper.toDomain(orm) : null;
  }
  // ...
}

// Module wiring
@Module({
  providers: [
    { provide: DI_TOKENS.CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  ],
})
export class CustomerModule {}
```

---

### 4. Presentation Layer (`src/presentation/`)

**Responsibility**: Handle HTTP requests, validation, and responses

#### Structure

```
src/presentation/
├── controllers/
│   ├── health.controller.ts
│   ├── customer.controller.ts
│   ├── product.controller.ts
│   ├── product-category.controller.ts
│   ├── stock.controller.ts
│   ├── transaction.controller.ts
│   ├── delivery.controller.ts
│   └── index.ts
│
├── dtos/
│   ├── common/
│   │   ├── api-response.dto.ts
│   │   └── index.ts
│   │
│   ├── customer/index.ts
│   ├── product/index.ts
│   ├── product-category/index.ts
│   ├── stock/index.ts
│   ├── transaction/index.ts
│   ├── delivery/index.ts
│   └── index.ts
│
├── helpers/
│   └── result-to-http.ts                   # unwrapResult: Result<T,E> -> HTTP response/exception
│
└── pipes/
    └── zod-validation.pipe.ts              # Zod-based request body validation
```

#### Key Characteristics

- ✅ **Thin Layer**: Controllers only map HTTP <-> use case calls
- ✅ **Zod Validation**: Request bodies validated with `ZodValidationPipe` (not class-validator)
- ✅ **Result unwrapping**: `unwrapResult()` converts `Result<T, DomainError>` to HTTP responses/exceptions
- ✅ **Swagger annotations**: Full `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiBody` coverage
- ✅ **Security**: `ApiKeyGuard` (global, with `@Public()` decorator to bypass per-route)

#### API URL Format

```
http://{host}:{port}{API_PREFIX}/{NODE_ENV}/{API_VERSION}/{resource}

# Examples:
http://localhost:3000/api/development/v1/customers
http://localhost:3000/api/production/v1/products
http://localhost:3000/api/development/v1/products/1/stock
```

Configured via environment variables: `API_PREFIX` (default `/api`), `NODE_ENV`, `API_VERSION` (default `v1`).

---

### 5. Shared Layer (`src/shared/`)

**Responsibility**: Cross-cutting concerns used across all layers

#### Structure

```
src/shared/
├── base.entity.ts                          # BaseEntity: id, createdAt, updatedAt + Zod base schema
├── result.ts                               # Result<T,E> type + ok/err/map/flatMap/asyncFlatMap helpers
├── di-tokens.ts                            # Dependency injection token constants
│
├── errors/
│   ├── infrastructure.error.ts             # InfrastructureError wrapper
│   └── index.ts
│
├── filters/
│   ├── http-exception.filter.ts            # Global HTTP exception -> JSON error response
│   └── index.ts
│
├── guards/
│   ├── api-key.guard.ts                    # x-api-key header guard
│   ├── public.decorator.ts                 # @Public() decorator to skip guard
│   └── index.ts
│
├── interceptors/
│   ├── logging.interceptor.ts              # HTTP request/response logging
│   └── index.ts
│
└── utils/
    └── index.ts
```

#### Key Characteristics

- ✅ **Result<T,E>**: Functional error handling — no unhandled thrown errors in business logic
- ✅ **BaseEntity**: Shared Zod `baseSchema` (id, createdAt, updatedAt) imported by domain entities
- ✅ **DI tokens**: String-based tokens centralised in `di-tokens.ts` to avoid magic strings
- ✅ **Framework Agnostic**: `result.ts`, `base.entity.ts` have zero NestJS dependency

---

## Boilerplate Templates

### Domain Entity Boilerplate

```typescript
// src/domain/models/product.entity.ts
import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';

export class Product {
  readonly id: number;
  readonly name: string;
  readonly categoryId: number;

  private constructor(props: ProductDto) {
    this.id = props.id;
    this.name = props.name;
    this.categoryId = props.categoryId;
  }

  static create(dto: CreateProductDto): Product {
    const now = new Date();
    return new Product({ id: 0, createdAt: now, updatedAt: now, ...dto });
  }

  static fromPersistence(props: ProductDto): Product {
    return new Product(props);
  }

  applyUpdate(dto: UpdateProductDto): Product {
    return new Product({ ...this, ...dto, updatedAt: new Date() });
  }
}

export const productSchema = baseSchema.extend({
  name: z.string().min(1).max(255),
  categoryId: z.number().int().positive(),
});

export const createProductSchema = productSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const updateProductSchema = createProductSchema.partial();

export type ProductDto = z.infer<typeof productSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
```

### Domain Error Boilerplate

```typescript
// src/domain/errors/not-found.error.ts
export class NotFoundError extends Error {
  constructor(entity: string, id: number | string) {
    super(`${entity} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

### Port/Interface Boilerplate

```typescript
// src/application/ports/out/product-repository.port.ts
import { Product } from '@domain/models/product.entity';

export interface IProductRepository {
  save(product: Product): Promise<Product>;
  findById(id: number): Promise<Product | null>;
  findAll(categoryId?: number): Promise<Product[]>;
  update(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
```

### Use Case Boilerplate

```typescript
// src/application/use-cases/product/create-product.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { Product, CreateProductDto } from '@domain/models/product.entity';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { Result, ok, err } from '@shared/result';
import { NotFoundError } from '@domain/errors';
import { DI_TOKENS } from '@shared/di-tokens';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(DI_TOKENS.PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Result<Product, NotFoundError>> {
    const product = Product.create(dto);
    const saved = await this.productRepository.save(product);
    return ok(saved);
  }
}
```

### Repository Implementation Boilerplate

```typescript
// src/infrastructure/adapters/database/product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/models/product.entity';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { ProductOrmEntity } from '@infrastructure/persistence/entities/product.orm-entity';
import { ProductMapper } from '@infrastructure/persistence/mappers/product.mapper';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<Product> {
    const orm = ProductMapper.toPersistence(product);
    const saved = await this.repository.save(orm);
    return ProductMapper.toDomain(saved);
  }

  async findById(id: number): Promise<Product | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? ProductMapper.toDomain(orm) : null;
  }

  async findAll(categoryId?: number): Promise<Product[]> {
    const orms = await this.repository.find(categoryId ? { where: { categoryId } } : {});
    return orms.map(ProductMapper.toDomain);
  }

  async update(product: Product): Promise<Product> {
    const orm = ProductMapper.toPersistence(product);
    const saved = await this.repository.save(orm);
    return ProductMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
```

### Controller Boilerplate

```typescript
// src/presentation/controllers/product.controller.ts
import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { createProductRequestSchema, CreateProductRequestDto } from '../dtos/product';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly createUseCase: CreateProductUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({ schema: { type: 'object', required: ['name', 'categoryId'], properties: { name: { type: 'string' }, categoryId: { type: 'number' } } } })
  @ApiResponse({ status: 201, description: 'Product created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body(new ZodValidationPipe(createProductRequestSchema)) dto: CreateProductRequestDto) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }
}
```

### Module Boilerplate (Dependency Injection)

```typescript
// src/modules/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductUseCase } from '@application/use-cases/product';
import { ProductRepository } from '@infrastructure/adapters/database';
import { ProductOrmEntity } from '@infrastructure/persistence/entities';
import { ProductController } from '@presentation/controllers';
import { DI_TOKENS } from '@shared/di-tokens';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    { provide: DI_TOKENS.PRODUCT_REPOSITORY, useClass: ProductRepository },
  ],
})
export class ProductModule {}
```

---

## Real-World Examples

### Example 1: Create Customer Flow

```
1. HTTP Request: POST /api/development/v1/customers
   {
     "customerDocumentTypeId": 1,
     "documentNumber": "1234567890",
     "email": "customer@example.com",
     "contactPhone": "+57 300 000 0000",
     "address": "Calle 1 #2-3"
   }
   |
2. ApiKeyGuard validates x-api-key header
   (HealthController uses @Public() to bypass this)
   |
3. CustomerController.create(dto)
   - ZodValidationPipe validates body against createCustomerRequestSchema
   |
4. CreateCustomerUseCase.execute(dto)
   - Checks for duplicate via CustomerRepository.findByEmail()
   - Calls Customer.create(dto) to build domain entity
   |
5. CustomerRepository.save(customer) [Infrastructure Adapter]
   - CustomerMapper.toPersistence(customer) -> CustomerOrmEntity
   - TypeORM saves to PostgreSQL
   - CustomerMapper.toDomain(orm) -> Customer
   |
6. Use case returns ok(customer): Result<Customer, AlreadyExistsError>
   |
7. unwrapResult(result) -> returns customer or throws HttpException
   |
8. HTTP Response: 201 Created
   {
     "id": 1,
     "customerDocumentTypeId": 1,
     "documentNumber": "1234567890",
     "email": "customer@example.com",
     "createdAt": "2026-03-05T00:00:00.000Z",
     "updatedAt": "2026-03-05T00:00:00.000Z"
   }
```

### Example 2: Create Transaction Flow

```
1. HTTP Request: POST /api/development/v1/transactions
   { "customerId": 1, "transactionStatusId": 1, "cut": "CUT-001" }
   |
2. TransactionController.create(dto)
   - ZodValidationPipe validates body
   |
3. CreateTransactionUseCase.execute(dto)
   - Verifies customer exists via CustomerRepository.findById()
   - Verifies transaction status exists via TransactionStatusRepository.findById()
   - Calls Transaction.create(dto)
   |
4. TransactionRepository.save(transaction)
   - Maps to ORM entity, persists, maps back to domain
   |
5. Returns ok(transaction) -> HTTP 201
```

### Example 3: Update Stock Flow

```
1. HTTP Request: PATCH /api/development/v1/products/1/stock
   { "quantity": 50 }
   |
2. StockController.update(productId=1, dto)
   |
3. UpdateStockUseCase.execute(productId=1, dto)
   - Finds stock by product via StockRepository.findByProductId()
   - If not found -> returns err(NotFoundError) -> HTTP 404
   - Applies: stock.applyUpdate(dto)
   - Saves updated stock
   |
4. unwrapResult -> HTTP 200 with updated Stock
```

---

## Testing Strategy

### Domain Layer Testing (Unit Tests)

```typescript
// test/unit/domain/models/customer.entity.spec.ts
describe('Customer Entity', () => {
  it('should create a new customer', () => {
    const customer = Customer.create({
      customerDocumentTypeId: 1,
      documentNumber: '123',
      email: 'test@example.com',
    });
    expect(customer.email).toBe('test@example.com');
    expect(customer.id).toBe(0);
  });

  it('should apply update preserving unchanged fields', () => {
    const customer = Customer.fromPersistence({
      id: 1, customerDocumentTypeId: 1, documentNumber: '123',
      email: 'test@example.com', contactPhone: null, address: null,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const updated = customer.applyUpdate({ address: 'Calle 1 #2-3' });
    expect(updated.address).toBe('Calle 1 #2-3');
    expect(updated.email).toBe('test@example.com');
  });
});
```

### Application Layer Testing (Use Case Tests)

```typescript
// test/unit/application/use-cases/customer/create-customer.use-case.spec.ts
describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let mockRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateCustomerUseCase(mockRepository);
  });

  it('should return ok with customer when email is unique', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(/* Customer instance */);

    const result = await useCase.execute({ customerDocumentTypeId: 1, documentNumber: '123', email: 'test@example.com' });

    expect(result.ok).toBe(true);
  });

  it('should return err(AlreadyExistsError) when email is taken', async () => {
    mockRepository.findByEmail.mockResolvedValue(/* existing Customer */);

    const result = await useCase.execute({ customerDocumentTypeId: 1, documentNumber: '456', email: 'test@example.com' });

    expect(result.ok).toBe(false);
  });
});
```

### Integration Tests (End-to-End)

```typescript
// test/e2e/customer.e2e-spec.ts
describe('Customer Controller (e2e)', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    app.setGlobalPrefix('api/test/v1');
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('POST /customers - should create a new customer', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/test/v1/customers',
      payload: { customerDocumentTypeId: 1, documentNumber: '123', email: 'test@example.com' },
    });
    expect(response.statusCode).toBe(201);
  });

  afterAll(async () => { await app.close(); });
});
```

---

## Best Practices

### 1. Dependency Injection

✅ **DO**: Use DI tokens from `di-tokens.ts`
```typescript
@Module({
  providers: [
    { provide: DI_TOKENS.CUSTOMER_REPOSITORY, useClass: CustomerRepository },
  ],
})
```

❌ **DON'T**: Use magic strings or create instances manually
```typescript
// Bad
{ provide: 'CustomerRepository', useClass: CustomerRepository }
const repository = new CustomerRepository();
```

### 2. Error Handling with Result Type

✅ **DO**: Return `Result<T, DomainError>` from use cases
```typescript
async execute(id: number): Promise<Result<Customer, NotFoundError>> {
  const customer = await this.repo.findById(id);
  if (!customer) return err(new NotFoundError('Customer', id));
  return ok(customer);
}
```

❌ **DON'T**: Throw domain errors from use cases
```typescript
// Bad
if (!customer) throw new Error('Customer not found');
```

### 3. Mapping Between Layers

✅ **DO**: Use explicit mappers at persistence boundaries
```typescript
// In repository adapter:
const domain = CustomerMapper.toDomain(ormEntity);
const orm = CustomerMapper.toPersistence(domainEntity);
```

❌ **DON'T**: Return ORM entities to upper layers
```typescript
// Bad — leaks ORM types to domain/application layers
return await this.repository.findOne({ where: { id } }); // CustomerOrmEntity
```

### 4. Validation

✅ **DO**: Validate at the HTTP boundary with Zod
```typescript
@Body(new ZodValidationPipe(createProductRequestSchema)) dto: CreateProductRequestDto
```

❌ **DON'T**: Validate inside use cases or domain for HTTP-level concerns
```typescript
// Bad
async execute(dto: any) {
  if (!dto.email) throw new Error('Email required');
}
```

### 5. Business Logic Location

✅ **DO**: Put entity mutation logic in domain entity methods
```typescript
// Domain Entity
applyUpdate(dto: UpdateCustomerDto): Customer {
  return new Customer({ ...this, ...dto, updatedAt: new Date() });
}
```

❌ **DON'T**: Mutate entities in use cases or repositories
```typescript
// Bad
customer.address = dto.address; // Breaks immutability
```

### 6. Configuration Management

✅ **DO**: Externalise all configuration via environment variables
```bash
# environment/development/.env
NODE_ENV=development
PORT=3000
API_PREFIX=/api
API_VERSION=v1
DB_HOST=localhost
```

❌ **DON'T**: Hardcode values in source files
```typescript
const port = 3000; // Bad
```

### 7. Transaction Management

✅ **DO**: Use TypeORM query runners for multi-step operations (as in the seed script)
```typescript
const queryRunner = AppDataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
  await queryRunner.query('...');
  await queryRunner.commitTransaction();
} catch {
  await queryRunner.rollbackTransaction();
}
```

### 8. Logging

✅ **DO**: Log at HTTP boundaries via the interceptor
```typescript
// LoggingInterceptor logs: METHOD URL STATUS - Xms for every request
// Controllers and use cases do not need manual per-request logging
```

---

## File Organization Checklist

When creating a new feature, follow this checklist:

### Domain Layer
- [ ] Create entity: `src/domain/models/{entity}.entity.ts` (with Zod schema + types co-located)
- [ ] Create domain errors if needed: `src/domain/errors/{entity}-{reason}.error.ts`
- [ ] Update exports: `src/domain/models/index.ts`, `src/domain/errors/index.ts`

### Application Layer
- [ ] Create driven port: `src/application/ports/out/{entity}-repository.port.ts`
- [ ] Create use cases: `src/application/use-cases/{entity}/{operation}-{entity}.use-case.ts`
- [ ] Create driving port (optional): `src/application/ports/in/{entity}.port.ts`
- [ ] Update exports: `src/application/ports/out/index.ts`, `src/application/use-cases/index.ts`

### Infrastructure Layer
- [ ] Create ORM entity: `src/infrastructure/persistence/entities/{entity}.orm-entity.ts`
- [ ] Create mapper: `src/infrastructure/persistence/mappers/{entity}.mapper.ts`
- [ ] Create repository adapter: `src/infrastructure/adapters/database/{entity}.repository.ts`
- [ ] Update exports in `index.ts` files under each directory

### Presentation Layer
- [ ] Create request/response DTOs: `src/presentation/dtos/{entity}/index.ts`
- [ ] Create controller: `src/presentation/controllers/{entity}.controller.ts`
- [ ] Update exports: `src/presentation/dtos/index.ts`, `src/presentation/controllers/index.ts`

### Module Setup
- [ ] Create module: `src/modules/{entity}/{entity}.module.ts`
- [ ] Wire DI: use cases + repository (via `DI_TOKENS`) + ORM entity via `TypeOrmModule.forFeature`
- [ ] Import module in `AppModule`

### Add DI Token
- [ ] Add new token to `src/shared/di-tokens.ts`
