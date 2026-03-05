/**
 * Entity Factory
 * ─────────────────────────────────────────────────────────────
 * Creates plain test instances of domain entities with sensible
 * defaults. Does NOT use TypeORM – just plain object assignment.
 * Use these in unit and e2e tests to avoid repeating fixture code.
 */

import { ProductCategory } from '@domain/models/product-category.entity';
import { Product } from '@domain/models/product.entity';
import { Stock } from '@domain/models/stock.entity';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { Customer } from '@domain/models/customer.entity';
import { TransactionStatus } from '@domain/models/transaction-status.entity';
import { Transaction } from '@domain/models/transaction.entity';
import { Delivery } from '@domain/models/delivery.entity';

const NOW = new Date('2024-01-15T10:00:00.000Z');

// ── ProductCategory ───────────────────────────────────────────

export function makeProductCategory(
  overrides: Partial<ProductCategory> = {},
): ProductCategory {
  return Object.assign(new ProductCategory(), {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: NOW,
    updatedAt: NOW,
    products: [],
    ...overrides,
  });
}

// ── Product ───────────────────────────────────────────────────

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return Object.assign(new Product(), {
    id: 1,
    uuid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Laptop Pro',
    description: 'High-performance laptop',
    imageUrl: 'https://example.com/laptop.png',
    categoryId: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── Stock ─────────────────────────────────────────────────────

export function makeStock(overrides: Partial<Stock> = {}): Stock {
  return Object.assign(new Stock(), {
    id: 1,
    productId: 1,
    description: 'Warehouse A',
    quantity: 50,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── CustomerDocumentType ──────────────────────────────────────

export function makeCustomerDocumentType(
  overrides: Partial<CustomerDocumentType> = {},
): CustomerDocumentType {
  return Object.assign(new CustomerDocumentType(), {
    id: 1,
    name: 'CC',
    description: 'Cédula de Ciudadanía',
    createdAt: NOW,
    updatedAt: NOW,
    customers: [],
    ...overrides,
  });
}

// ── Customer ──────────────────────────────────────────────────

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  return Object.assign(new Customer(), {
    id: 1,
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'john.doe@example.com',
    contactPhone: '+57 300 000 0000',
    address: 'Calle 1 # 2-3',
    createdAt: NOW,
    updatedAt: NOW,
    transactions: [],
    deliveries: [],
    ...overrides,
  });
}

// ── TransactionStatus ─────────────────────────────────────────

export function makeTransactionStatus(
  overrides: Partial<TransactionStatus> = {},
): TransactionStatus {
  return Object.assign(new TransactionStatus(), {
    id: 1,
    name: 'PENDING',
    description: 'Awaiting processing',
    createdAt: NOW,
    updatedAt: NOW,
    transactions: [],
    ...overrides,
  });
}

// ── Transaction ───────────────────────────────────────────────

export function makeTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return Object.assign(new Transaction(), {
    id: 1,
    customerId: 1,
    cut: null,
    transactionStatusId: 1,
    createdAt: NOW,
    updatedAt: NOW,
    deliveries: [],
    ...overrides,
  });
}

// ── Delivery ──────────────────────────────────────────────────

export function makeDelivery(overrides: Partial<Delivery> = {}): Delivery {
  return Object.assign(new Delivery(), {
    id: 1,
    uuid: 'dddddddd-eeee-ffff-0000-111122223333',
    customerId: 1,
    customerAddressId: null,
    transactionId: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}
