# Project Code Standards for Claude Code

This file instructs Claude Code on the exact code style, architecture, and tooling rules
for this project. Always follow these rules when generating, editing, or refactoring code.

---

## 1. Runtime & Language

- **Language**: TypeScript only — no plain `.js` files inside `src/`.
- **Target**: ES2022 (`target: "ES2022"`, `module: "commonjs"`).
- **Decorators**: `experimentalDecorators` and `emitDecoratorMetadata` are **enabled** —
  use class-based decorators freely (TypeORM, NestJS, etc.).
- **Strict mode is ON** — never use `@ts-ignore` or `as any` to silence type errors;
  fix the root cause instead.

---

## 2. Project Architecture (Clean Architecture)

The `tsconfig.json` paths define the mandatory layer structure. Always place files in
the correct layer and use the path alias — never use deep relative imports across layers.

```
src/
├── domain/           → @domain/*      Pure business logic: entities, value objects, domain events, repository interfaces
├── application/      → @application/* Use cases, DTOs, application services, ports
├── infrastructure/   → @infrastructure/* TypeORM repositories, external services, DB config, adapters
├── presentation/     → @presentation/* Controllers, resolvers, HTTP/WS handlers, request/response mappers
└── shared/           → @shared/*      BaseEntity, Zod base schemas, utils, constants, errors
```

### Layer dependency rules (innermost = highest priority)

```
presentation → application → domain
infrastructure → domain (implements domain interfaces)
shared ← all layers may import from shared
```

- `@domain/*` must **never** import from `@application/*`, `@infrastructure/*`, or
  `@presentation/*`.
- `@application/*` must **never** import from `@infrastructure/*` or `@presentation/*`.
- Cross-layer wiring belongs in a composition root (e.g., a NestJS module file).

---

## 3. Formatting (Prettier)

All code **must** pass `prettier --check`. Key rules derived from `.prettierrc`:

| Rule | Value |
|---|---|
| Print width | 100 characters |
| Indentation | 2 spaces (no tabs) |
| Semicolons | required |
| Quotes | single quotes (`'`) in TS/JS |
| JSX quotes | double quotes |
| Trailing commas | all (including function params) |
| Bracket spacing | `{ key: value }` |
| Arrow parens | always — `(x) => x` not `x => x` |
| End of line | LF |

**Never** manually wrap lines — let Prettier handle it at 100 chars.

---

## 4. Linting (ESLint + typescript-eslint)

Toolchain: `@eslint/js` recommended + `tseslint.configs.recommendedTypeChecked` +
`eslint-plugin-prettier`.

### Rules that are errors (block CI)

- All `prettier/prettier` violations → **error**.
- All `@eslint/js` recommended rules → **error**.
- All `typescript-eslint` type-checked recommended rules → **error** (except overrides below).

### Downgraded to warnings (fix before merging, not blocking)

```
@typescript-eslint/no-floating-promises   → warn
@typescript-eslint/no-unsafe-argument     → warn
@typescript-eslint/no-unsafe-assignment   → warn
@typescript-eslint/no-unsafe-member-access→ warn
@typescript-eslint/no-unsafe-return       → warn
```

> Prefer fixing warnings rather than leaving them — warnings are tech debt.

### Turned off

- `@typescript-eslint/no-explicit-any` is **off**. You may use `any` when genuinely
  needed (e.g., generic utility types), but document why with a comment.

### Ignored paths

`eslint.config.mjs`, `dist/`, `coverage/`, `node_modules/` — never lint these.

---

## 5. TypeScript Strictness Rules

Derived from `tsconfig.json` `compilerOptions`:

- `strict: true` — all strict sub-flags active.
- `noImplicitAny: true` — every variable must have an inferable or explicit type.
- `strictNullChecks: true` — never assume a value is non-null without a guard.
- `strictBindCallApply: true` — `.call()` / `.bind()` / `.apply()` must be typed.
- `noFallthroughCasesInSwitch: true` — every `case` block must `break`, `return`,
  or `throw`.
- `forceConsistentCasingInFileNames: true` — file imports must match disk case exactly.
- `skipLibCheck: true` — do not add `// @ts-nocheck` just because a `.d.ts` fails.

---

## 6. BaseEntity & Zod Pattern

Every TypeORM entity **must** extend `BaseEntity` from `@shared/base.entity` and
**must** export its three Zod schemas. Follow this exact pattern:

```typescript
// src/domain/product/product-category.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from '@shared/base.entity';

@Entity('product_categories')
export class ProductCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}

// ── Zod ──────────────────────────────────────────────────────
export const productCategorySchema = baseSchema.extend({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
});

export const createProductCategorySchema = productCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductCategorySchema = createProductCategorySchema.partial();

export type ProductCategoryDto       = z.infer<typeof productCategorySchema>;
export type CreateProductCategoryDto = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryDto = z.infer<typeof updateProductCategorySchema>;
```

Rules:
- `entitySchema` — full shape, used for API responses.
- `createEntitySchema` — omits `id`, `createdAt`, `updatedAt` (server-generated).
- `updateEntitySchema` — `.partial()` of create (supports PATCH semantics).
- All DTOs are inferred from Zod — **never** write separate `interface`/`class` DTOs
  for the same shape.
- Validate at the presentation layer using the Zod schema before passing data inward.

---

## 7. Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Files | `kebab-case` | `product-category.entity.ts` |
| Classes | `PascalCase` | `ProductCategory` |
| Interfaces | `PascalCase`, no `I` prefix | `ProductRepository` |
| Variables / functions | `camelCase` | `findById` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| DB table names | `snake_case` plural | `product_categories` |
| DB column names | `snake_case` | `category_id`, `created_at` |
| Zod schemas | `camelCase` + `Schema` suffix | `productCategorySchema` |
| Zod DTO types | `PascalCase` + `Dto` suffix | `CreateProductCategoryDto` |
| Path aliases | `@layer/path` | `@domain/product/product.entity` |

---

## 8. Import Order

Always order imports as follows (enforced by ESLint + Prettier):

1. Node built-ins (`node:fs`, `node:path`, …)
2. Third-party packages (`typeorm`, `zod`, `@nestjs/…`)
3. Internal `@layer/*` aliases (alphabetical by layer: `@domain`, `@application`,
   `@infrastructure`, `@presentation`, `@shared`)
4. Relative imports (`./`, `../`) — avoid across layers

Separate each group with a blank line. Never mix groups.

```typescript
// ✅ correct
import { readFileSync } from 'node:fs';

import { Entity, Column } from 'typeorm';
import { z } from 'zod';

import { BaseEntity, baseSchema } from '@shared/base.entity';
import type { ProductRepository } from '@domain/product/product.repository';

import { someLocalHelper } from './helpers';
```

---

## 9. Comments & Documentation

- Use `//` for single-line implementation notes.
- Use `/** JSDoc */` only on exported public APIs (classes, methods, types).
- Remove all `console.log` debug statements before committing — use a logger service.
- Comments in English only.
- If a field name preserves a known typo from an external system (e.g., `adresss`),
  add an inline comment: `// NOTE: typo kept intentional to match external schema`.

---

## 10. What Claude Must NOT Do

- Do **not** create `.js` files inside `src/`.
- Do **not** use `require()` — use ESM-style `import`.
- Do **not** use `any` without a justification comment.
- Do **not** bypass strict null checks with `!` non-null assertion without a guard comment.
- Do **not** import across layers in the wrong direction.
- Do **not** use relative imports (`../../`) across layer boundaries — use `@layer/*` aliases.
- Do **not** write standalone DTO interfaces when a Zod schema already infers the type.
- Do **not** add new entities without the three Zod schemas (`schema`, `createSchema`, `updateSchema`).
- Do **not** modify `eslint.config.mjs`, `.prettierrc`, or `tsconfig.json` unless
  explicitly instructed.
- Do **not** add emojis to markdown files
- Do **not** create tests unless explicitly instructed.


---

## 11. File Templates

### New Entity

```
src/domain/<feature>/<feature>.entity.ts
```

### New Use Case

```
src/application/<feature>/use-cases/<action>-<feature>.use-case.ts
```

### New Repository Interface

```
src/domain/<feature>/<feature>.repository.ts   (interface only)
src/infrastructure/<feature>/<feature>.typeorm-repository.ts  (implementation)
```

### New Controller

```
src/presentation/<feature>/<feature>.controller.ts
```