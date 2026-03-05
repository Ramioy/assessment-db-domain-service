# Hexagonal Architecture (Clean Architecture)

This project follows the **Hexagonal Architecture** pattern, also known as **Clean Architecture** or **Port & Adapter** pattern.

## Architecture Layers

### 1. **Domain Layer** (`src/domain/`)
**Purpose**: Encapsulates enterprise business rules and core application logic

- **`models/`**: Domain entities and value objects
  - No external dependencies
  - Represents business concepts

- **`exceptions/`**: Domain-specific exceptions
  - Business rule violations
  - Domain constraints

- **`services/`**: Pure business logic that spans multiple entities
  - Stateless operations
  - Domain calculations and validations

**Key Rule**: The domain layer must NOT depend on any other layer.

---

### 2. **Application Layer** (`src/application/`)
**Purpose**: Orchestrates domain logic and coordinates use cases

- **`use-cases/`**: Application services (interactors)
  - One use case per user story
  - Coordinate domain logic and repositories
  - Handle transactions and workflows

- **`ports/`**: Interfaces (contracts) for dependencies
  - **`in/`** (Driving Ports): How external actors use the application
  - **`out/`** (Driven Ports): How the application uses external systems

**Key Rule**: Application layer depends on domain and ports, but NOT on implementations.

---

### 3. **Infrastructure Layer** (`src/infrastructure/`)
**Purpose**: Implements technical concerns and external integrations

- **`adapters/`**: Implementations of ports
  - **`database/`**: Repository implementations (PostgreSQL, MongoDB, etc.)
  - **`external/`**: Third-party service integrations (AWS S3, Stripe, etc.)

- **`config/`**: Framework and tool configurations
  - TypeORM/Prisma setup
  - Redis configuration
  - Database connections

**Key Rule**: Infrastructure adapts application ports to concrete technologies.

---

### 4. **Presentation Layer** (`src/presentation/`)
**Purpose**: Entry points for external requests (HTTP, events, CLI, etc.)

- **`controllers/`**: NestJS HTTP controllers
  - Receive HTTP requests
  - Call use cases
  - Return responses

- **`dtos/`**: Data Transfer Objects
  - Request validation schemas
  - Response serialization shapes

**Key Rule**: Controllers are driving adapters - they call use cases, not repositories directly.

---

### 5. **Shared Layer** (`src/shared/`)
**Purpose**: Cross-cutting concerns used across all layers

- **`utils/`**: Utility functions and helpers

- **`filters/`**: Global exception filters
  - Transform exceptions to HTTP responses
  - Logging and error handling

---

## Dependency Flow

```
        Presentation (Driving Adapter)
              ↓
        Application (Use Cases + Ports)
          ↙         ↘
     Domain      Infrastructure (Driven Adapters)
```

**Golden Rule**:
- Inner layers (Domain) don't depend on outer layers
- Only outer layers depend on inner layers
- Dependencies point inward

---

## File Naming Conventions

| Layer | Entity | Pattern | Example |
|-------|--------|---------|---------|
| Domain | Entity | `{name}.entity.ts` | `user.entity.ts` |
| Domain | Exception | `{name}.exception.ts` | `user-not-found.exception.ts` |
| Domain | Service | `{name}.service.ts` | `user-validation.service.ts` |
| Application | Use Case | `{action}.use-case.ts` | `create-user.use-case.ts` |
| Application | Port (Interface) | `{name}.port.ts` | `repository.port.ts` |
| Infrastructure | Repository | `{orm}-{entity}.repository.ts` | `postgres-user.repository.ts` |
| Infrastructure | Service | `{provider}-{service}.ts` | `aws-s3.service.ts` |
| Presentation | Controller | `{entity}.controller.ts` | `user.controller.ts` |
| Presentation | DTO | `{action}-{object}.dto.ts` | `create-user.dto.ts` |

---

## Example: Create User Flow

```
1. HTTP Request
   ↓
2. UserController.create(CreateUserDto)
   ↓
3. CreateUserUseCase.execute(input)
   ↓
4. UserRepository.findByEmail() [Infrastructure]
   ↓
5. UserDomainService.validateUser() [Domain]
   ↓
6. User.create() [Domain Entity]
   ↓
7. UserRepository.save(user) [Infrastructure]
   ↓
8. HTTP Response
```

---

## Benefits

✅ **Testability**: Domain layer can be tested without frameworks
✅ **Flexibility**: Swap infrastructure implementations easily
✅ **Maintainability**: Clear separation of concerns
✅ **Scalability**: Easy to add new features
✅ **Independence**: Business logic independent of frameworks

---

## Getting Started

1. Define domain entities in `domain/models/`
2. Create domain exceptions in `domain/exceptions/`
3. Define ports in `application/ports/`
4. Implement use cases in `application/use-cases/`
5. Create repositories in `infrastructure/adapters/database/`
6. Build controllers in `presentation/controllers/`
7. Define DTOs in `presentation/dtos/`
