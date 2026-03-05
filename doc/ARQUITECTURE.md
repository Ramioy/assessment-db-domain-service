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
│         (HTTP Controllers, CLI, Events, Message Queues)     │
│  - UserController               - ProductController         │
│  - CreateUserDto                - UpdateProductDto          │
└──────────────────────┬──────────────────────────────────────┘
                       │ (depends on)
┌──────────────────────▼──────────────────────────────────────┐
│                      APPLICATION LAYER                      │
│            (Use Cases, Orchestration, Workflows)            │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  CreateUserUseCase            UpdateUserUseCase       │  │
│  │  FindUserUseCase              DeleteUserUseCase       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   PORTS (Interfaces)                  │  │
│  │  ┌──────────────────────┐   ┌──────────────────────┐  │  │
│  │  │ Driving Ports        │   │ Driven Ports         │  │  │
│  │  │ (Input)              │   │ (Output)             │  │  │
│  │  │ - Commands           │   │ - UserRepository     │  │  │
│  │  │ - Queries            │   │ - EmailService       │  │  │
│  │  │ - Events             │   │ - PaymentService     │  │  │
│  │  └──────────────────────┘   └──────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ (depends on)
┌──────────────────────▼──────────────────────────────────────┐
│                        DOMAIN LAYER                         │
│          (Business Rules, Entities, Value Objects)          │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  User (Entity)              Email (Value Object)      │  │
│  │  Product (Entity)           Money (Value Object)      │  │
│  │  Order (Entity)             Address (Value Object)    │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  UserDomainService          ProductDomainService      │  │
│  │  OrderDomainService         ValidationService         │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  UserNotFoundException      InvalidEmailException     │  │
│  │  InsufficientStockException ValidationException       │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │ (NO DEPENDENCIES - PURE LOGIC)
       ┌───────────────┴───────────────┐
       │                               │
┌──────▼────────────┐ ┌────────────────▼───┐ ┌───────────────┐
│ INFRASTRUCTURE    │ │ SHARED UTILITIES   │ │ EXTERNAL      │
│ (Driven Adapters) │ │                    │ │ SERVICES      │
├───────────────────┤ ├────────────────────┤ ├───────────────┤
│ Database:         │ │ - HttpClient       │ │ - AWS S3      │
│ - PostgresUserRepo│ │ - DateUtils        │ │ - Stripe      │
│ - PostgresOrdRepo │ │ - StringUtils      │ │ - Auth0       │
│                   │ │ - MathUtils        │ │ - SendGrid    │
│ Cache:            │ │ - Logger           │ │               │
│ - RedisCache      │ │ - EventEmitter     │ │ (Adapters)    │
│                   │ │ - Validators       │ │               │
│ External Services:│ └────────────────────┘ └───────────────┘
│ - EmailService    │
│ - PaymentAdapter  │
│ - FileStorageAdapt│
│ - NotificationAdpt│
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
├── models/                      # Entities and Value Objects
│   ├── base.entity.ts          # Abstract base entity
│   ├── user.entity.ts          # User aggregate root
│   ├── product.entity.ts       # Product aggregate root
│   ├── order.entity.ts         # Order aggregate root
│   ├── value-objects/
│   │   ├── email.value-object.ts
│   │   ├── money.value-object.ts
│   │   └── address.value-object.ts
│   └── index.ts
│
├── exceptions/                  # Domain-specific exceptions
│   ├── user-not-found.exception.ts
│   ├── invalid-email.exception.ts
│   ├── insufficient-stock.exception.ts
│   └── index.ts
│
├── services/                    # Pure business logic
│   ├── user-validation.service.ts
│   ├── order-calculation.service.ts
│   ├── product-inventory.service.ts
│   └── index.ts
│
└── interfaces/                  # Pure domain contracts (optional)
    ├── aggregate.interface.ts
    └── index.ts
```

#### Key Characteristics

- ✅ **Zero External Dependencies**: No NestJS, no database, no HTTP libraries
- ✅ **Business Rules Only**: Validation, calculations, state transitions
- ✅ **Immutability**: Consider value objects as immutable
- ✅ **Type Safety**: Strong typing for domain concepts
- ✅ **No Side Effects**: Pure functions where possible

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
│   │   ├── create-user.command.ts
│   │   ├── find-user.query.ts
│   │   ├── delete-user.command.ts
│   │   └── index.ts
│   │
│   └── out/                                 # Driven Ports (Output)
│       ├── repository.port.ts              # Base repository interface
│       ├── user-repository.port.ts
│       ├── order-repository.port.ts
│       ├── email-service.port.ts
│       ├── payment-service.port.ts
│       ├── notification-service.port.ts
│       └── index.ts
│
├── use-cases/
│   ├── user/
│   │   ├── create-user.use-case.ts
│   │   ├── find-user.use-case.ts
│   │   ├── find-all-users.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   ├── delete-user.use-case.ts
│   │   └── index.ts
│   │
│   ├── product/
│   │   ├── create-product.use-case.ts
│   │   ├── find-product.use-case.ts
│   │   ├── update-stock.use-case.ts
│   │   └── index.ts
│   │
│   ├── order/
│   │   ├── create-order.use-case.ts
│   │   ├── find-order.use-case.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── dto/                                     # Application DTOs
│   ├── user/
│   │   ├── create-user.input.ts
│   │   ├── user.output.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
└── index.ts
```

#### Key Characteristics

- ✅ **Use Case Per Feature**: One use case = one user story
- ✅ **Depends on Ports**: Not concrete implementations
- ✅ **Orchestrates Domain**: Coordinates entities and services
- ✅ **Transaction Boundaries**: Defines ACID boundaries
- ✅ **Input/Output DTOs**: Isolates internal models

#### Port Types

**Driving Ports** (How external actors use the app):
- Commands: Actions that change state (Create, Update, Delete)
- Queries: Read-only operations (Find, List, Search)

**Driven Ports** (How the app uses external systems):
- Repository: Data persistence
- External Services: Email, Payment, SMS, etc.

---

### 3. Infrastructure Layer (`src/infrastructure/`)

**Responsibility**: Implement technical details and external integrations

#### Structure

```
src/infrastructure/
├── adapters/
│   ├── database/
│   │   ├── base.repository.ts              # Base repository
│   │   ├── typeorm/
│   │   │   ├── entities/
│   │   │   │   ├── user.orm-entity.ts
│   │   │   │   └── product.orm-entity.ts
│   │   │   ├── typeorm-user.repository.ts
│   │   │   ├── typeorm-product.repository.ts
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   ├── prisma-user.repository.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── external/
│   │   ├── email/
│   │   │   ├── sendgrid-email.service.ts
│   │   │   ├── mailgun-email.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── stripe-payment.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── storage/
│   │   │   ├── aws-s3.service.ts
│   │   │   ├── local-storage.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── notification/
│   │   │   ├── fcm-notification.service.ts
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── index.ts
│
├── config/
│   ├── database.config.ts                  # Database setup (TypeORM, Prisma)
│   ├── cache.config.ts                     # Redis configuration
│   ├── env.validation.ts                   # Environment validation
│   ├── constants.ts                        # Config constants
│   └── index.ts
│
├── persistence/                            # Optional: Persistence patterns
│   ├── decorators/
│   │   ├── transactional.decorator.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
└── index.ts
```

#### Key Characteristics

- ✅ **Adapts Ports**: Implements application ports
- ✅ **Framework Integration**: NestJS dependency injection
- ✅ **ORM/Database**: TypeORM, Prisma, MongoDB, etc.
- ✅ **External Services**: API clients, SDKs
- ✅ **Swappable**: Can replace implementations easily

#### Adapter Pattern

```typescript
// Port (Application Layer)
export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

// Adapter (Infrastructure Layer)
@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(private readonly userRepository: Repository<UserOrmEntity>) {}

  async save(user: User): Promise<void> {
    const ormEntity = this.mapToOrmEntity(user);
    await this.userRepository.save(ormEntity);
  }

  // ... other methods
}

// Module wiring (Dependency Injection)
@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
})
export class UserModule {}
```

---

### 4. Presentation Layer (`src/presentation/`)

**Responsibility**: Handle HTTP requests, validation, and responses

#### Structure

```
src/presentation/
├── controllers/
│   ├── user.controller.ts
│   ├── product.controller.ts
│   ├── order.controller.ts
│   └── index.ts
│
├── dtos/
│   ├── user/
│   │   ├── create-user.request.dto.ts
│   │   ├── update-user.request.dto.ts
│   │   ├── user.response.dto.ts
│   │   └── index.ts
│   │
│   ├── product/
│   │   ├── create-product.request.dto.ts
│   │   ├── product.response.dto.ts
│   │   └── index.ts
│   │
│   ├── common/
│   │   ├── pagination.dto.ts
│   │   ├── error.response.dto.ts
│   │   └── index.ts
│   │
│   └── index.ts
│
├── interceptors/
│   ├── logging.interceptor.ts
│   ├── response.interceptor.ts
│   └── index.ts
│
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── role.guard.ts
│   └── index.ts
│
└── index.ts
```

#### Key Characteristics

- ✅ **Thin Layer**: Minimal logic, mostly orchestration
- ✅ **DTO Validation**: Request/response validation
- ✅ **HTTP Abstraction**: Controllers adapt HTTP to use cases
- ✅ **Security**: Authentication, authorization, rate limiting
- ✅ **Serialization**: DTO mappers for response shaping

---

### 5. Shared Layer (`src/shared/`)

**Responsibility**: Cross-cutting concerns used across all layers

#### Structure

```
src/shared/
├── utils/
│   ├── string.util.ts
│   ├── date.util.ts
│   ├── crypto.util.ts
│   ├── validation.util.ts
│   └── index.ts
│
├── constants/
│   ├── http.constants.ts
│   ├── error-codes.constants.ts
│   ├── messages.constants.ts
│   └── index.ts
│
├── filters/
│   ├── http-exception.filter.ts
│   ├── all-exceptions.filter.ts
│   └── index.ts
│
├── decorators/
│   ├── is-valid-email.decorator.ts
│   ├── current-user.decorator.ts
│   ├── api-response.decorator.ts
│   └── index.ts
│
├── types/
│   ├── pagination.types.ts
│   ├── api-response.types.ts
│   └── index.ts
│
└── index.ts
```

#### Key Characteristics

- ✅ **Reusable**: Used across multiple layers
- ✅ **No Business Logic**: Only utilities and helpers
- ✅ **Framework Agnostic**: Where possible
- ✅ **Well Organized**: Clear categorization

---

## Boilerplate Templates

### Domain Entity Boilerplate

```typescript
// src/domain/models/user.entity.ts
import { BaseEntity } from './base.entity';

export class User extends BaseEntity {
  private email: string;
  private name: string;
  private isActive: boolean;

  constructor(id: string, email: string, name: string) {
    super(id);
    this.email = email;
    this.name = name;
    this.isActive = true;
  }

  static create(email: string, name: string): User {
    // Business logic for creation
    const id = this.generateId();
    return new User(id, email, name);
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  isActive(): boolean {
    return this.isActive;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }
}
```

### Value Object Boilerplate

```typescript
// src/domain/models/value-objects/email.value-object.ts
export class Email {
  readonly value: string;

  constructor(value: string) {
    if (!this.isValid(value)) {
      throw new InvalidEmailException(value);
    }
    this.value = value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
```

### Domain Service Boilerplate

```typescript
// src/domain/services/user-validation.service.ts
import { User } from '../models/user.entity';

export class UserValidationService {
  validateForCreation(email: string, name: string): void {
    if (!email || !name) {
      throw new ValidationException('Email and name are required');
    }

    if (name.length < 3) {
      throw new ValidationException('Name must be at least 3 characters');
    }
  }

  validateForUpdate(user: User, newData: Partial<User>): void {
    // Validation logic
  }
}
```

### Port/Interface Boilerplate

```typescript
// src/application/ports/out/user-repository.port.ts
import { User } from 'src/domain/models/user.entity';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(filters?: any): Promise<User[]>;
}
```

### Use Case Boilerplate

```typescript
// src/application/use-cases/user/create-user.use-case.ts
import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/models/user.entity';
import { IUserRepository } from 'src/application/ports/out/user-repository.port';
import { CreateUserInput } from './create-user.input';
import { UserOutput } from './user.output';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(input.email);
    }

    // Create domain entity
    const user = User.create(input.email, input.name);

    // Persist
    await this.userRepository.save(user);

    // Return output
    return this.mapToOutput(user);
  }

  private mapToOutput(user: User): UserOutput {
    return {
      id: user.id,
      email: user.getEmail(),
      name: user.getName(),
    };
  }
}
```

### Repository Implementation Boilerplate

```typescript
// src/infrastructure/adapters/database/typeorm/typeorm-user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/domain/models/user.entity';
import { IUserRepository } from 'src/application/ports/out/user-repository.port';
import { UserOrmEntity } from './entities/user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<void> {
    const ormEntity = this.mapToPersistence(user);
    await this.repository.save(ormEntity);
  }

  async findById(id: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? this.mapToDomain(ormEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const ormEntity = await this.repository.findOne({ where: { email } });
    return ormEntity ? this.mapToDomain(ormEntity) : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async update(user: User): Promise<void> {
    const ormEntity = this.mapToPersistence(user);
    await this.repository.save(ormEntity);
  }

  async findAll(): Promise<User[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map(e => this.mapToDomain(e));
  }

  private mapToDomain(ormEntity: UserOrmEntity): User {
    return Object.assign(new User(ormEntity.id, ormEntity.email, ormEntity.name), {
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
    });
  }

  private mapToPersistence(user: User): UserOrmEntity {
    return Object.assign(new UserOrmEntity(), {
      id: user.id,
      email: user.getEmail(),
      name: user.getName(),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }
}
```

### Controller Boilerplate

```typescript
// src/presentation/controllers/user.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user.use-case';
import { FindUserUseCase } from 'src/application/use-cases/user/find-user.use-case';
import { CreateUserRequestDto } from '../dtos/user/create-user.request.dto';
import { UserResponseDto } from '../dtos/user/user.response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserUseCase: FindUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return await this.createUserUseCase.execute({
      email: dto.email,
      name: dto.name,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.findUserUseCase.execute({ id });
  }
}
```

### DTO Boilerplate

```typescript
// src/presentation/dtos/user/create-user.request.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  name: string;
}

// src/presentation/dtos/user/user.response.dto.ts
export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Module Boilerplate (Dependency Injection)

```typescript
// src/modules/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Domain
import { UserValidationService } from 'src/domain/services/user-validation.service';

// Application
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user.use-case';
import { FindUserUseCase } from 'src/application/use-cases/user/find-user.use-case';

// Infrastructure
import { TypeOrmUserRepository } from 'src/infrastructure/adapters/database/typeorm/typeorm-user.repository';
import { UserOrmEntity } from 'src/infrastructure/adapters/database/typeorm/entities/user.orm-entity';

// Presentation
import { UserController } from 'src/presentation/controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [
    // Domain Services
    UserValidationService,

    // Use Cases
    CreateUserUseCase,
    FindUserUseCase,

    // Infrastructure
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
```

---

## Real-World Examples

### Example 1: Create User Flow

```
1. HTTP Request: POST /users
   {
     "email": "user@example.com",
     "name": "John Doe"
   }
   ↓
2. UserController.create(CreateUserRequestDto)
   - Validate DTO using class-validator
   ↓
3. CreateUserUseCase.execute(input)
   - Call UserRepository.findByEmail() to check existence
   ↓
4. UserRepository.findByEmail() [Driven Adapter]
   - Query database via TypeORM
   ↓
5. CreateUserUseCase continues
   - Create User entity via User.create()
   - Call UserValidationService.validateForCreation()
   ↓
6. User Entity [Domain]
   - Set properties
   - Validate business rules
   ↓
7. CreateUserUseCase continues
   - Call UserRepository.save(user)
   ↓
8. UserRepository.save() [Driven Adapter]
   - Map domain User to ORM entity
   - Save to PostgreSQL
   ↓
9. CreateUserUseCase returns UserOutput
   ↓
10. UserController returns UserResponseDto
    ↓
11. HTTP Response: 201 Created
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    }
```

### Example 2: Find User by Email Flow

```
1. HTTP Request: GET /users/search?email=user@example.com
   ↓
2. UserController.findByEmail(email)
   ↓
3. FindUserByEmailUseCase.execute(input)
   - Call UserRepository.findByEmail(email)
   ↓
4. UserRepository.findByEmail() [Driven Adapter]
   - Query database
   ↓
5. If not found
   - Throw UserNotFoundException [Domain Exception]
   ↓
6. FindUserByEmailUseCase
   - Map domain User to output DTO
   ↓
7. UserController returns UserResponseDto
   ↓
8. HTTP Response: 200 OK or 404 Not Found
```

---

## Testing Strategy

### Domain Layer Testing (Unit Tests)

```typescript
// test/domain/models/user.entity.spec.ts
describe('User Entity', () => {
  it('should create a new user', () => {
    const user = User.create('test@example.com', 'John Doe');

    expect(user.getEmail()).toBe('test@example.com');
    expect(user.getName()).toBe('John Doe');
    expect(user.isActive()).toBe(true);
  });

  it('should deactivate a user', () => {
    const user = User.create('test@example.com', 'John Doe');
    user.deactivate();

    expect(user.isActive()).toBe(false);
  });

  it('should throw when creating with invalid email', () => {
    expect(() => {
      User.create('invalid-email', 'John Doe');
    }).toThrow(InvalidEmailException);
  });
});
```

### Application Layer Testing (Use Case Tests)

```typescript
// test/application/use-cases/user/create-user.use-case.spec.ts
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      // ... other methods
    };
    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create a new user', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);

    const result = await useCase.execute({
      email: 'test@example.com',
      name: 'John Doe',
    });

    expect(result.email).toBe('test@example.com');
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should throw when user already exists', async () => {
    const existingUser = User.create('test@example.com', 'Existing');
    mockRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(
      useCase.execute({
        email: 'test@example.com',
        name: 'John Doe',
      }),
    ).rejects.toThrow(UserAlreadyExistsException);
  });
});
```

### Integration Tests (End-to-End)

```typescript
// test/e2e/user.e2e.spec.ts
describe('User Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /users - should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        name: 'John Doe',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toBe('test@example.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## Best Practices

### 1. Dependency Injection

✅ **DO**: Use NestJS DI at module level
```typescript
@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: TypeOrmUserRepository,
    },
  ],
})
```

❌ **DON'T**: Create instances manually
```typescript
// Bad
const repository = new TypeOrmUserRepository();
const useCase = new CreateUserUseCase(repository);
```

### 2. Exception Handling

✅ **DO**: Create domain-specific exceptions
```typescript
export class UserNotFoundException extends Error {
  constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
```

❌ **DON'T**: Throw generic errors
```typescript
// Bad
throw new Error('User not found');
```

### 3. Mapping Between Layers

✅ **DO**: Map at layer boundaries
```typescript
// Application → Presentation
private mapToOutput(user: User): UserOutput {
  return {
    id: user.id,
    email: user.getEmail(),
  };
}
```

❌ **DON'T**: Return domain objects directly
```typescript
// Bad - exposes domain implementation
async findById(id: string): Promise<User> {
  return await this.repository.findById(id);
}
```

### 4. Port Segregation

✅ **DO**: Segregate large ports
```typescript
// Multiple focused ports
export interface IUserRepository { }
export interface IUserEmailService { }
export interface IUserNotificationService { }
```

❌ **DON'T**: Create god interfaces
```typescript
// Bad - too many responsibilities
export interface IUserService {
  save();
  findById();
  sendEmail();
  sendSMS();
  notify();
}
```

### 5. Business Logic Location

✅ **DO**: Put business logic in domain
```typescript
// Domain Service
export class UserValidationService {
  validateEmail(email: string): void {
    // Business rule validation
  }
}
```

❌ **DON'T**: Put business logic in use cases
```typescript
// Bad - logic should be in domain
export class CreateUserUseCase {
  async execute(input): Promise<void> {
    if (!input.email.includes('@')) {
      throw new Error('Invalid email');
    }
  }
}
```

### 6. Aggregate Roots

✅ **DO**: Enforce encapsulation through aggregate roots
```typescript
export class Order extends BaseEntity {
  private items: OrderItem[] = [];

  addItem(item: OrderItem): void {
    // Business rules for adding items
    this.items.push(item);
  }

  getItems(): OrderItem[] {
    return [...this.items]; // Return copy
  }
}
```

❌ **DON'T**: Allow direct manipulation
```typescript
// Bad - breaks encapsulation
order.items.push(newItem);
```

### 7. Transaction Management

✅ **DO**: Define transaction boundaries in use cases
```typescript
@Injectable()
export class CreateOrderUseCase {
  @Transactional()
  async execute(input: CreateOrderInput): Promise<OrderOutput> {
    // All database operations in this method run in one transaction
  }
}
```

### 8. Error Handling

✅ **DO**: Use custom exceptions with proper HTTP mapping
```typescript
// Global Exception Filter
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof UserNotFoundException) {
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    }
  }
}
```

### 9. Configuration Management

✅ **DO**: Externalize configuration
```typescript
// environment/development/.env
DATABASE_URL=postgresql://user:pass@localhost/db
JWT_SECRET=your-secret-key
API_TIMEOUT=5000
```

❌ **DON'T**: Hardcode values
```typescript
const dbUrl = 'postgresql://user:pass@localhost/db';
```

### 10. Logging

✅ **DO**: Log at appropriate boundaries
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly logger: Logger) {}

  async execute(input: CreateUserInput): Promise<UserOutput> {
    this.logger.log(`Creating user with email: ${input.email}`);
    // ...
  }
}
```

---

## File Organization Checklist

When creating a new feature, follow this checklist:

### Domain Layer
- [ ] Create entity: `src/domain/models/{entity}.entity.ts`
- [ ] Create exceptions: `src/domain/exceptions/{entity}-{reason}.exception.ts`
- [ ] Create domain service: `src/domain/services/{entity}-{operation}.service.ts`
- [ ] Update exports: `src/domain/models/index.ts`, `src/domain/exceptions/index.ts`

### Application Layer
- [ ] Create input DTO: `src/application/dto/{entity}/{operation}.input.ts`
- [ ] Create output DTO: `src/application/dto/{entity}/{entity}.output.ts`
- [ ] Create out port: `src/application/ports/out/{entity}-{operation}.port.ts`
- [ ] Create use case: `src/application/use-cases/{entity}/{operation}-{entity}.use-case.ts`
- [ ] Update exports: `src/application/ports/index.ts`, `src/application/use-cases/index.ts`

### Infrastructure Layer
- [ ] Create ORM entity: `src/infrastructure/adapters/database/typeorm/entities/{entity}.orm-entity.ts`
- [ ] Create repository: `src/infrastructure/adapters/database/typeorm/typeorm-{entity}.repository.ts`
- [ ] Update exports: `src/infrastructure/adapters/index.ts`

### Presentation Layer
- [ ] Create request DTO: `src/presentation/dtos/{entity}/{operation}-{entity}.request.dto.ts`
- [ ] Create response DTO: `src/presentation/dtos/{entity}/{entity}.response.dto.ts`
- [ ] Create controller: `src/presentation/controllers/{entity}.controller.ts`
- [ ] Update exports: `src/presentation/dtos/index.ts`, `src/presentation/controllers/index.ts`

### Module Setup
- [ ] Create module: `src/modules/{entity}/{entity}.module.ts`
- [ ] Wire dependencies in module
- [ ] Import module in `AppModule`

---
