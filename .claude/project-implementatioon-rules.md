# Project Implementation Standards for Claude Code

This file defines the architecture, programming paradigms, and work-process rules that
Claude Code must follow when implementing any feature, module, or file in this project.
These rules apply to **all** code generation, editing, and refactoring tasks.

---

## 1. Architecture — Hexagonal (Ports & Adapters)

The project is structured around Hexagonal Architecture. The **domain** is the center;
everything else adapts to it — never the reverse.

```
                        ┌─────────────────────────────┐
  Driving Adapters      │                             │     Driven Adapters
  (HTTP, CLI, WS)  ───► │      APPLICATION CORE       │ ───► (DB, Email, Queue,
                        │  Domain + Application Layer  │       External APIs)
                        │                             │
                        └─────────────────────────────┘
                               ▲            ▲
                           Input Port   Output Port
                           (Use Case)  (Repository Interface)
```

### Mandatory rules

- **Ports** are interfaces defined in `@domain/` or `@application/`. They express
  *what* the system needs, never *how* it is provided.
- **Adapters** live in `@infrastructure/` (driven) or `@presentation/` (driving).
  They implement or consume ports.
- The domain core (`@domain/*`) must have **zero** knowledge of frameworks, ORMs,
  HTTP, or any I/O mechanism.
- Dependency inversion is mandatory: application code depends on port interfaces;
  infrastructure provides concrete implementations injected at the composition root.
- Never let a framework decorator (`@Injectable`, `@Column`, `@Get`) bleed into the
  domain layer.

### Layer responsibilities

| Layer | Folder | Responsibility |
|---|---|---|
| Domain | `@domain/*` | Entities, Value Objects, Domain Events, Repository interfaces, Domain Services |
| Application | `@application/*` | Use Cases, Input/Output ports, Application Services, DTOs |
| Infrastructure | `@infrastructure/*` | TypeORM repos, external clients, messaging, config |
| Presentation | `@presentation/*` | Controllers, route handlers, request/response mapping |
| Shared | `@shared/*` | BaseEntity, Zod base schemas, Result type, utilities |

---

## 2. Railway Oriented Programming (ROP)

All operations that can fail **must** return a `Result<T, E>` type instead of throwing
exceptions for expected business errors. Exceptions are reserved for truly unexpected,
unrecoverable faults.

### Result type (keep in `@shared/result.ts`)

```typescript
export type Success<T> = { ok: true; value: T };
export type Failure<E> = { ok: false; error: E };
export type Result<T, E = Error> = Success<T> | Failure<E>;

export const ok  = <T>(value: T): Success<T> => ({ ok: true,  value });
export const err = <E>(error: E): Failure<E> => ({ ok: false, error });
```

### Usage rules

- Use cases **must** return `Promise<Result<OutputDto, DomainError>>`.
- Chain results explicitly — never unwrap a `Result` without checking `ok` first.
- Domain errors are typed value objects, not plain strings:

```typescript
// ✅ correct
export class CustomerAlreadyExistsError {
  readonly code = 'CUSTOMER_ALREADY_EXISTS';
  constructor(readonly email: string) {}
}

// ❌ wrong — throws breaks the railway
throw new Error('Customer already exists');
```

- The presentation layer is the **only** place allowed to convert a `Failure` into an
  HTTP error response or exception.
- Never use `try/catch` inside domain or application layers for business logic —
  only for infrastructure boundary errors (network, DB timeout, etc.).

### Railway flow pattern

```typescript
// application layer use case
async execute(dto: CreateCustomerDto): Promise<Result<CustomerDto, CustomerAlreadyExistsError>> {
  const existing = await this.customerRepo.findByEmail(dto.email);
  if (existing) return err(new CustomerAlreadyExistsError(dto.email));

  const customer = Customer.create(dto);
  await this.customerRepo.save(customer);

  return ok(customerSchema.parse(customer));
}
```

---

## 3. Clean Code Rules

### Naming

- Names must express **intent**, not implementation detail.
  `findActiveCustomersByRegion` — not `getData` or `query1`.
- Boolean variables and return types: prefix with `is`, `has`, `can`, `should`.
- Avoid abbreviations unless they are universally understood (`id`, `dto`, `url`).

### Functions & Methods

- One function = one responsibility. If a method does two things, split it.
- Maximum **3 parameters**. If more are needed, use a typed options object or DTO.
- No boolean trap parameters: `sendEmail(user, true)` — extract to two explicit methods
  or a discriminated union option.
- Keep functions short. If a function body exceeds ~20 lines, it likely has more than
  one responsibility.

### Classes

- Follow the Single Responsibility Principle strictly.
- Prefer composition over inheritance (except `BaseEntity` and framework base classes).
- Constructors do **not** contain business logic — use static factory methods:

```typescript
// ✅ correct
export class Customer extends BaseEntity {
  private constructor(props: CustomerProps) { super(props.id); }

  static create(dto: CreateCustomerDto): Result<Customer, ValidationError> { ... }
}
```

### Magic values

- No magic strings or numbers inline. Extract to named constants in `@shared/constants`
  or as domain enum values.

### Comments

- Code must be self-documenting. If a comment is needed to explain *what*, rename instead.
- Comments explain *why* — business rationale, regulatory requirement, known limitation.
- Delete commented-out code — version control preserves history.

---

## 4. Design Patterns — When and Which

Apply patterns purposefully. Never add a pattern for its own sake.

| Pattern | When to use | Where |
|---|---|---|
| **Repository** | Isolate persistence from domain | `@domain/` interface + `@infrastructure/` impl |
| **Factory Method / Static Factory** | Complex object creation with validation | Domain entity classes |
| **Use Case (Command/Query)** | Each discrete user action or query | `@application/use-cases/` |
| **Mapper** | Convert between layers (entity ↔ DTO) | `@application/` or `@presentation/` |
| **Strategy** | Interchangeable algorithms (payment methods, notification channels) | `@application/` + `@infrastructure/` |
| **Observer / Domain Event** | Decouple side-effects from core logic | `@domain/events/` + handlers in `@application/` |
| **Decorator** | Cross-cutting concerns (logging, caching, retry) | `@infrastructure/` adapters |
| **Specification** | Encapsulate complex domain query predicates | `@domain/<feature>/specifications/` |
| **Null Object** | Avoid null checks for optional dependencies | `@shared/` or feature domain |

### Anti-patterns to avoid

- **Anemic Domain Model** — entities must contain behaviour, not be plain data bags.
- **God Class / God Module** — if a file grows beyond ~150 lines, question its scope.
- **Shotgun Surgery** — a single business rule change should touch exactly one place.
- **Primitive Obsession** — wrap meaningful primitives in Value Objects
  (`Email`, `DocumentNumber`, `Money`).
- **Service Locator** — use constructor injection; never reach into a container manually.

---

## 5. Consistency Rules

- One pattern per problem across the entire codebase. If `Result<T, E>` is used in one
  use case, it is used in **all** use cases — no mixing with thrown exceptions.
- If a naming or structural convention exists anywhere in the project, replicate it
  exactly when adding something similar — do not invent a parallel convention.
- All new features must mirror the folder and file structure of an existing feature.
  When in doubt, look at the nearest analogous feature and copy its structure.
- Zod schemas are the single source of truth for shape validation — never add a
  separate `class-validator` or manual validation alongside an existing Zod schema.

---

## 6. Structured, Sequential & Incremental Implementation

This is the most critical process rule. Claude must **never** fill a file with a large
volume of code in a single pass. Implementation must follow a deliberate, layered
sequence.

### The mandatory sequence for any new feature

```
Step 1 — Domain
  └─ Define the entity / value objects
  └─ Define repository interface (port)
  └─ Define domain errors

Step 2 — Application
  └─ Define use case input/output DTOs (Zod schemas)
  └─ Implement one use case at a time
  └─ Wire the use case to the repository port

Step 3 — Infrastructure
  └─ Implement the TypeORM repository (adapter)
  └─ Add any external service adapters needed

Step 4 — Presentation
  └─ Implement the controller / route handler
  └─ Map request → DTO → use case → response

Step 5 — Tests
  └─ Unit test each use case
  └─ Integration test the repository adapter
  └─ E2E test the route
```

### Incremental file filling rules

- **One logical unit per response.** When implementing a file, deliver one complete,
  compilable logical unit at a time: one entity, one use case, one controller method.
- **Never dump an entire module in a single block.** If a file will eventually have
  5 methods, implement and confirm the first before adding the next.
- **Stop and surface blockers early.** If step N requires a decision or clarification
  about step N+1, stop and ask before writing more code.
- **Never scaffold placeholder methods** (`// TODO: implement`) and move on —
  incomplete stubs must not exist in committed code.
- **Maximum one new file per response** unless the user explicitly requests a batch.
  When multiple files are needed, state the plan, implement the first, and wait for
  confirmation before proceeding.

### Example of correct incremental flow

```
User: "Implement the CreateTransaction use case"

Claude step 1: Creates domain error types for transactions → shows file → waits
Claude step 2: Creates Transaction entity (if not exists) → shows file → waits
Claude step 3: Creates TransactionRepository interface → shows file → waits
Claude step 4: Creates CreateTransactionDto Zod schemas → shows file → waits
Claude step 5: Implements CreateTransactionUseCase → shows file → waits
Claude step 6: Implements TypeORM adapter → shows file → waits
Claude step 7: Implements controller method → shows file → done
```

> If the user asks Claude to "go faster" or "do it all at once", Claude may batch steps
> within the same layer but **never** across layers in a single response.

---

## 7. What Claude Must NOT Do

- Do **not** implement an entire feature end-to-end in one response without being
  asked to do so.
- Do **not** simplify, refactor, or restructure existing code unless explicitly asked.
- Do **not** mix patterns — no hybrid Result + throw approaches in the same layer.
- Do **not** add framework concerns to the domain layer.
- Do **not** create anemic entities that are pure data containers with no behaviour.
- Do **not** skip the domain error types and return generic `Error` objects.
- Do **not** write use cases that call other use cases — compose at the application
  service level or orchestrate in the presentation layer.
- Do **not** add a new structural convention if an equivalent one already exists.