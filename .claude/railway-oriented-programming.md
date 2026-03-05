# Railway Oriented Programming — Implementation Guide

This guide documents the exact way Railway Oriented Programming (ROP) is implemented
in this project. Every example here uses the project's real layer structure and naming
conventions. Read this before writing any use case, domain service, or application service.

---

## 1. The Mental Model

Think of every operation as a two-track railway:

```
         ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
Input ──► │ Step 1  │──► │ Step 2  │──► │ Step 3  │──► │ Output  │  ← Success track
         └─────────┘    └─────────┘    └─────────┘    └─────────┘

         ┌─────────┐
Input ──► │ Step 1  │──► ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─►  Error   ← Failure track
         └─────────┘    (switches to failure track, skips 2 & 3)
```

Once an operation switches to the **failure track**, all subsequent steps are **bypassed
automatically** — no nested `if/else` chains, no exception handling in business logic.
Each step is a function that receives a `Result` and either continues on the success
track or passes the failure through unchanged.

---

## 2. The Result Type

The canonical `Result<T, E>` lives in `@shared/result.ts`. This is the **only** error
propagation mechanism allowed in the domain and application layers.

```typescript
// src/shared/result.ts

export type Success<T> = { readonly ok: true;  readonly value: T };
export type Failure<E> = { readonly ok: false; readonly error: E };
export type Result<T, E = Error> = Success<T> | Failure<E>;

// ── Constructors ──────────────────────────────────────────────
export const ok  = <T>(value: T): Success<T> => ({ ok: true,  value });
export const err = <E>(error: E): Failure<E> => ({ ok: false, error });

// ── Type guards ───────────────────────────────────────────────
export const isOk  = <T, E>(r: Result<T, E>): r is Success<T> => r.ok === true;
export const isErr = <T, E>(r: Result<T, E>): r is Failure<E> => r.ok === false;

// ── Railway combinators ───────────────────────────────────────

/**
 * map — transform the success value; pass failures through unchanged.
 */
export const map = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> => (result.ok ? ok(fn(result.value)) : result);

/**
 * flatMap (bind / andThen) — chain a step that itself returns a Result.
 * This is the core ROP combinator.
 */
export const flatMap = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> => (result.ok ? fn(result.value) : result);

/**
 * mapErr — transform the error type; pass successes through unchanged.
 */
export const mapErr = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> => (result.ok ? result : err(fn(result.error)));

/**
 * asyncFlatMap — async version of flatMap for use-case chains.
 */
export const asyncFlatMap = async <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> => (result.ok ? fn(result.value) : result);

/**
 * fromThrowable — wraps a function that might throw into a Result.
 * Use ONLY at infrastructure boundaries (DB calls, external APIs).
 */
export const fromThrowable = <T>(
  fn: () => T,
  onThrow: (e: unknown) => Error = (e) => e instanceof Error ? e : new Error(String(e)),
): Result<T, Error> => {
  try {
    return ok(fn());
  } catch (e) {
    return err(onThrow(e));
  }
};

/**
 * fromPromise — wraps a Promise that might reject into a Result.
 * Use ONLY at infrastructure boundaries.
 */
export const fromPromise = async <T>(
  promise: Promise<T>,
  onReject: (e: unknown) => Error = (e) => e instanceof Error ? e : new Error(String(e)),
): Promise<Result<T, Error>> => {
  try {
    return ok(await promise);
  } catch (e) {
    return err(onReject(e));
  }
};
```

---

## 3. Domain Errors

Every possible business failure is a **typed value object** in
`@domain/<feature>/errors/`. Never use plain `Error` or string literals to represent
domain failures.

### Naming convention

```
<EntityName><FailureReason>Error
```

### Structure

```typescript
// src/domain/customer/errors/customer-already-exists.error.ts

export class CustomerAlreadyExistsError {
  readonly code = 'CUSTOMER_ALREADY_EXISTS' as const;
  readonly message: string;

  constructor(readonly email: string) {
    this.message = `A customer with email "${email}" already exists.`;
  }
}
```

```typescript
// src/domain/customer/errors/customer-not-found.error.ts

export class CustomerNotFoundError {
  readonly code = 'CUSTOMER_NOT_FOUND' as const;
  readonly message: string;

  constructor(readonly id: number) {
    this.message = `Customer with id ${id} was not found.`;
  }
}
```

### Union error type per feature

Group all errors for a feature into a discriminated union. This is what use cases return:

```typescript
// src/domain/customer/errors/index.ts

import { CustomerAlreadyExistsError } from './customer-already-exists.error';
import { CustomerNotFoundError }       from './customer-not-found.error';
import { InvalidDocumentNumberError }  from './invalid-document-number.error';

export type CustomerError =
  | CustomerAlreadyExistsError
  | CustomerNotFoundError
  | InvalidDocumentNumberError;

export { CustomerAlreadyExistsError, CustomerNotFoundError, InvalidDocumentNumberError };
```

---

## 4. Use Case Signature

Every use case **must** return `Promise<Result<OutputDto, DomainErrorUnion>>`.
No exceptions, no `void` returns for operations that can fail.

```typescript
// src/application/customer/use-cases/create-customer.use-case.ts

import { ok, err }                          from '@shared/result';
import type { Result }                       from '@shared/result';
import type { CustomerRepository }           from '@domain/customer/customer.repository';
import { Customer }                          from '@domain/customer/customer.entity';
import { CustomerAlreadyExistsError }        from '@domain/customer/errors';
import type { CustomerError }                from '@domain/customer/errors';
import {
  createCustomerSchema,
  type CreateCustomerDto,
  type CustomerDto,
  customerSchema,
} from '@domain/customer/customer.entity';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepo: CustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<Result<CustomerDto, CustomerError>> {
    // Step 1 — validate input (Zod throws on parse; wrap at boundary)
    const parsed = createCustomerSchema.safeParse(dto);
    if (!parsed.success) {
      return err(new InvalidDocumentNumberError(parsed.error.message));
    }

    // Step 2 — check business rule
    const existing = await this.customerRepo.findByEmail(parsed.data.email);
    if (existing) {
      return err(new CustomerAlreadyExistsError(parsed.data.email));
    }

    // Step 3 — create domain entity
    const customerResult = Customer.create(parsed.data);
    if (!customerResult.ok) return customerResult;

    // Step 4 — persist
    const saved = await this.customerRepo.save(customerResult.value);

    // Step 5 — return success
    return ok(customerSchema.parse(saved));
  }
}
```

---

## 5. Chaining Steps with the Combinators

When a use case has multiple sequential steps that each return a `Result`, use
`asyncFlatMap` to keep the chain flat instead of nesting `if (!result.ok)` guards.

### Without combinators (avoid — pyramid of doom)

```typescript
// ❌ wrong — manual unwrapping creates nesting
async execute(dto: CreateTransactionDto): Promise<Result<TransactionDto, TransactionError>> {
  const customerResult = await this.findCustomer(dto.customerId);
  if (!customerResult.ok) return customerResult;

  const statusResult = await this.findStatus(dto.statusId);
  if (!statusResult.ok) return statusResult;

  const createResult = Transaction.create({ customer: customerResult.value, status: statusResult.value });
  if (!createResult.ok) return createResult;

  const savedResult = await this.saveTransaction(createResult.value);
  if (!savedResult.ok) return savedResult;

  return ok(transactionSchema.parse(savedResult.value));
}
```

### With combinators (prefer — flat railway chain)

```typescript
// ✅ correct — each step feeds into the next; failures short-circuit automatically
async execute(dto: CreateTransactionDto): Promise<Result<TransactionDto, TransactionError>> {
  const customerResult = await this.findCustomer(dto.customerId);

  const statusResult   = await asyncFlatMap(customerResult,   () => this.findStatus(dto.statusId));
  const entityResult   =       flatMap(statusResult, (status) =>
    Transaction.create({ customer: /* stored from customerResult */ ..., status }),
  );
  const savedResult    = await asyncFlatMap(entityResult, (tx) => this.saveTransaction(tx));

  return map(savedResult, (saved) => transactionSchema.parse(saved));
}
```

> For long chains it is acceptable to use explicit `if (!result.ok) return result` guards
> when the combinator form reduces readability. Consistency within a file matters more
> than strict combinator use.

---

## 6. Domain Entity — Static Factory Method

Entities must validate their own invariants and return a `Result`, never throw.

```typescript
// src/domain/customer/customer.entity.ts  (excerpt)

import { ok, err, type Result } from '@shared/result';
import { InvalidDocumentNumberError } from './errors';

export class Customer extends BaseEntity {
  private constructor(
    id: number,
    readonly email: string,
    readonly documentNumber: string,
    readonly customerDocumentTypeId: number,
  ) {
    super(id);
  }

  static create(dto: CreateCustomerDto): Result<Customer, InvalidDocumentNumberError> {
    if (!isValidDocument(dto.documentNumber)) {
      return err(new InvalidDocumentNumberError(dto.documentNumber));
    }
    // additional invariant checks …
    return ok(new Customer(0, dto.email, dto.documentNumber, dto.customerDocumentTypeId));
  }
}
```

---

## 7. Infrastructure Boundary — Wrapping Exceptions

Infrastructure adapters (TypeORM repos, HTTP clients) are the **only** place where
`try/catch` or `fromPromise` / `fromThrowable` may be used. Their job is to convert
thrown exceptions into typed `Result` failures before they cross into the application layer.

```typescript
// src/infrastructure/customer/customer.typeorm-repository.ts

import { fromPromise, type Result } from '@shared/result';
import { InfrastructureError }      from '@shared/errors/infrastructure.error';
import type { CustomerRepository }  from '@domain/customer/customer.repository';

export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(private readonly repo: Repository<CustomerOrmEntity>) {}

  async findByEmail(email: string): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(
      this.repo.findOneBy({ email }),
      (e) => new InfrastructureError('DB_QUERY_FAILED', e),
    );
  }

  async save(customer: Customer): Promise<Result<Customer, InfrastructureError>> {
    return fromPromise(
      this.repo.save(CustomerMapper.toOrm(customer)),
      (e) => new InfrastructureError('DB_SAVE_FAILED', e),
    );
  }
}
```

---

## 8. Presentation Layer — Unwrapping Results

The presentation layer is the **only** place allowed to unwrap a `Result` and convert
it to an HTTP response or thrown HTTP exception.

```typescript
// src/presentation/customer/customer.controller.ts  (NestJS example)

import { isOk } from '@shared/result';
import { CustomerAlreadyExistsError, CustomerNotFoundError } from '@domain/customer/errors';

@Post()
async create(@Body() body: unknown): Promise<CustomerDto> {
  const dto    = createCustomerSchema.parse(body);          // throws HttpException on invalid input
  const result = await this.createCustomerUseCase.execute(dto);

  if (isOk(result)) return result.value;

  // Map domain errors → HTTP status codes
  const { error } = result;
  if (error instanceof CustomerAlreadyExistsError) throw new ConflictException(error.message);
  if (error instanceof CustomerNotFoundError)      throw new NotFoundException(error.message);

  throw new InternalServerErrorException('Unexpected error');
}
```

---

## 9. Rules Summary

| Rule | ✅ Do | ❌ Do not |
|---|---|---|
| Error propagation | Return `Result<T, E>` | `throw` inside domain/application layers |
| Domain errors | Typed value objects with `code` + `message` | `new Error('string')` or string literals |
| Infra exceptions | Wrap with `fromPromise` / `fromThrowable` | Let DB/network exceptions bubble to app layer |
| Result unwrapping | Only in the presentation layer | Unwrap mid-chain without checking `ok` |
| Entity validation | Static factory returning `Result` | Constructor throwing or `setX()` mutating blindly |
| Combinators | `flatMap` / `asyncFlatMap` for sequential steps | Nested `if (!r.ok)` pyramids |
| Chaining failures | Return the `Failure` as-is | Re-wrap in a new error type (loses context) |
| Infrastructure errors | `InfrastructureError` wrapper type | Letting `QueryFailedError` reach the domain |

---

## 10. Anti-Patterns to Avoid

### Swallowed failure
```typescript
// ❌ — ignores the failure track entirely
const result = await useCase.execute(dto);
return result.value!; // non-null assertion hides a potential undefined
```

### Mixed paradigm
```typescript
// ❌ — mixes throw and Result in the same layer
async execute(dto) {
  if (!dto.email) throw new BadRequestException('email required'); // throw in app layer
  const found = await this.repo.findByEmail(dto.email);
  if (!found) return err(new CustomerNotFoundError(0));            // Result in same layer
}
```

### Catching and re-throwing in the domain
```typescript
// ❌ — domain should never use try/catch for business logic
static create(dto) {
  try {
    validate(dto);
    return ok(new Customer(dto));
  } catch (e) {
    throw new DomainException(e); // still an exception, not a Result
  }
}
```

### Returning null instead of a typed failure
```typescript
// ❌ — null forces callers to guess what went wrong
async findByEmail(email: string): Promise<Customer | null> { ... }

// ✅ — explicit failure with context
async findByEmail(email: string): Promise<Result<Customer, CustomerNotFoundError>> { ... }
```