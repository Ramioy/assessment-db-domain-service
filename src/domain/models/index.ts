// ─────────────────────────────────────────────────────────────
//  Wompi Assessment — TypeORM Entities + Zod Schemas  (barrel)
// ─────────────────────────────────────────────────────────────

export * from './base.entity';
export * from './product-category.entity';
export * from './product.entity';
export * from './stock.entity';
export * from './customer-document-type.entity';
export * from './customer.entity';
export * from './transaction-status.entity';
export * from './transaction.entity';
export * from './delivery.entity';

// ─────────────────────────────────────────────
//  TypeORM DataSource entities array (convenience)
// ─────────────────────────────────────────────
import { ProductCategory }      from './product-category.entity';
import { Product }              from './product.entity';
import { Stock }                from './stock.entity';
import { CustomerDocumentType } from './customer-document-type.entity';
import { Customer }             from './customer.entity';
import { TransactionStatus }    from './transaction-status.entity';
import { Transaction }          from './transaction.entity';
import { Delivery }             from './delivery.entity';

export const ALL_ENTITIES = [
  ProductCategory,
  Product,
  Stock,
  CustomerDocumentType,
  Customer,
  TransactionStatus,
  Transaction,
  Delivery,
] as const;
