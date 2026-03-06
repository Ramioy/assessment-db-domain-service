export { CustomerOrmEntity } from './customer.orm-entity';
export { CustomerDocumentTypeOrmEntity } from './customer-document-type.orm-entity';
export { ProductOrmEntity } from './product.orm-entity';
export { ProductCategoryOrmEntity } from './product-category.orm-entity';
export { StockOrmEntity } from './stock.orm-entity';
export { TransactionOrmEntity } from './transaction.orm-entity';
export { TransactionStatusOrmEntity } from './transaction-status.orm-entity';
export { DeliveryOrmEntity } from './delivery.orm-entity';

import { CustomerOrmEntity } from './customer.orm-entity';
import { CustomerDocumentTypeOrmEntity } from './customer-document-type.orm-entity';
import { ProductOrmEntity } from './product.orm-entity';
import { ProductCategoryOrmEntity } from './product-category.orm-entity';
import { StockOrmEntity } from './stock.orm-entity';
import { TransactionOrmEntity } from './transaction.orm-entity';
import { TransactionStatusOrmEntity } from './transaction-status.orm-entity';
import { DeliveryOrmEntity } from './delivery.orm-entity';

export const ALL_ORM_ENTITIES = [
  CustomerOrmEntity,
  CustomerDocumentTypeOrmEntity,
  ProductOrmEntity,
  ProductCategoryOrmEntity,
  StockOrmEntity,
  TransactionOrmEntity,
  TransactionStatusOrmEntity,
  DeliveryOrmEntity,
] as const;
