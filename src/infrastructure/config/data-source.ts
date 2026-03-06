import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';

import { ProductCategory } from '@domain/models/product-category.entity';
import { Product } from '@domain/models/product.entity';
import { Stock } from '@domain/models/stock.entity';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { Customer } from '@domain/models/customer.entity';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { Transaction } from '@domain/models/transaction.entity';
import { Delivery } from '@domain/models/delivery.entity';

/**
 * Standalone TypeORM DataSource used by the TypeORM CLI for migrations.
 * Reads configuration directly from environment variables.
 * Usage: typeorm-ts-node-commonjs migration:generate -d src/infrastructure/config/data-source.ts
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    ProductCategory,
    Product,
    Stock,
    CustomerDocumentType,
    Customer,
    TransactionStatus,
    Transaction,
    Delivery,
  ],
  migrations: [path.join(__dirname, '../../../migrations/*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
});
