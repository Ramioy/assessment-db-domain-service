export { NotFoundError } from './not-found.error';
export { AlreadyExistsError } from './already-exists.error';
export { InsufficientStockError } from './insufficient-stock.error';
export { InvalidTransactionError } from './invalid-transaction.error';
export { InfrastructureError } from './infrastructure.error';

import type { NotFoundError as _NF } from './not-found.error';
import type { AlreadyExistsError as _AE } from './already-exists.error';
import type { InsufficientStockError as _IS } from './insufficient-stock.error';
import type { InvalidTransactionError as _IT } from './invalid-transaction.error';
import type { InfrastructureError as _IE } from './infrastructure.error';

export type DomainError = _NF | _AE | _IS | _IT | _IE;
