# Test Implementation Standards for Claude Code

This file governs how Claude Code writes, edits, and scaffolds **all test files** in this
project. These rules complement `CLAUDE.md` and take precedence over it inside any
`*.spec.ts` or `*.e2e-spec.ts` file.

---

## 1. Mandatory File Header

Every test file **must** begin with these two directives — in this exact order, on the
first two lines, before any imports:

```typescript
// @ts-nocheck
/* eslint-disable */
```

> **Corrections applied to the original spec:**
> - `@ts-nocheck` must be a single-line comment (`// @ts-nocheck`), not a block comment.
>   TypeScript only recognises it as a directive when written on its own line with `//`.
> - `/*eslint-ignore*/` is not a valid ESLint directive. The correct file-level directive
>   that disables all rules for the entire file is `/* eslint-disable */`
>   (space before `eslint`, space after `*/` boundary — no rule name needed to suppress
>   everything). `// eslint-disable-next-line` and `// eslint-ignore` are not valid
>   file-level directives.

Full example of a compliant file opening:

```typescript
// @ts-nocheck
/* eslint-disable */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { createMockCustomer } from '../../test/helpers/customer.helper';
// … rest of file
```

---

## 2. Test Helper Utilities

All reusable test utilities (factories, builders, stubs, mock creators, fixtures) **must**
live under:

```
<project-root>/test/helpers/
```

### Rules

- Never inline a factory or fixture directly inside a test file if it could be reused
  across more than one spec. Extract it to `test/helpers/`.
- Helper files follow the naming pattern `<feature>.helper.ts`
  (e.g., `customer.helper.ts`, `transaction.helper.ts`).
- Import helpers using a relative path from the spec file to `test/helpers/`:

```typescript
// from src/application/customer/__tests__/create-customer.use-case.spec.ts
import { buildCustomer, buildCreateCustomerDto } from '../../../../test/helpers/customer.helper';
```

- Helper functions must be typed — the `// @ts-nocheck` header on the **spec** file does
  not apply to helper files. Helpers in `test/helpers/` must compile cleanly and are
  subject to normal linting.
- A helper file must export named functions only — no default exports.

### Suggested helper structure

```
test/
└── helpers/
    ├── base.helper.ts              ← shared factory primitives (ids, dates, pagination)
    ├── customer.helper.ts
    ├── product.helper.ts
    ├── transaction.helper.ts
    └── delivery.helper.ts
```

---

## 3. No Simplification of Implementation Code

When writing or fixing tests, Claude **must not** alter, simplify, refactor, or
"clean up" any source file under `src/` unless the user explicitly asks for it.

This includes — but is not limited to:

- Shortening method bodies.
- Replacing explicit type annotations with inferred ones.
- Collapsing constructor parameters.
- Removing intermediate variables.
- Changing a class to a function or vice-versa.
- Rewriting a Zod schema shape.
- Modifying decorators or their options.

If a test cannot be written as-is because the implementation has a structural problem,
**stop and report the issue** with a clear explanation instead of silently modifying the
source.

---

## 4. Test File Location & Naming

| Test type | Location | Suffix |
|---|---|---|
| Unit | next to the source file in a `__tests__/` folder | `.spec.ts` |
| Integration | `test/integration/<feature>/` | `.integration-spec.ts` |
| E2E | `test/e2e/` | `.e2e-spec.ts` |

Examples:

```
src/application/customer/use-cases/__tests__/
    create-customer.use-case.spec.ts

test/integration/customer/
    customer-repository.integration-spec.ts

test/e2e/
    customer.e2e-spec.ts
```

---

## 5. General Test Writing Rules

- **Describe blocks** must mirror the class or function under test:
  `describe('CreateCustomerUseCase', () => { ... })`.
- **Nested describe** for method groups: `describe('execute()', () => { ... })`.
- **It blocks** must read as a sentence: `it('should throw when email already exists')`.
- Use `beforeEach` for setup; never share mutable state across `it` blocks without
  resetting it in `beforeEach`.
- Prefer explicit `expect` assertions over snapshot tests for domain logic.
- Do not use `test()` — use `it()` consistently.
- Do not use `fit()`, `fdescribe()`, `xit()`, or `xdescribe()` — remove focus/skip
  flags before committing.

---

## 6. What Claude Must NOT Do in Test Files

- Do **not** omit the `// @ts-nocheck` + `/* eslint-disable */` header.
- Do **not** place helper factories inline inside a spec if a helper file exists or
  should exist for that feature.
- Do **not** create helper files outside `test/helpers/`.
- Do **not** modify any file under `src/` while working on a test.
- Do **not** use `any` casts to work around missing helper types — add the type to the
  helper file instead.
- Do **not** leave `console.log` calls in test files.
- Do **not** use `.only` or `.skip` in committed code.