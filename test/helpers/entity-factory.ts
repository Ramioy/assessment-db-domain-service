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

export function makeProductCategory(overrides: Partial<ProductCategory> = {}): ProductCategory {
  return ProductCategory.fromPersistence({
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── Product ───────────────────────────────────────────────────

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return Product.fromPersistence({
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
  return Stock.fromPersistence({
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
  return CustomerDocumentType.fromPersistence({
    id: 1,
    name: 'CC',
    description: 'Cédula de Ciudadanía',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── Customer ──────────────────────────────────────────────────

export function makeCustomer(overrides: Partial<Customer> = {}): Customer {
  return Customer.fromPersistence({
    id: 1,
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'john.doe@example.com',
    contactPhone: '+57 300 000 0000',
    address: 'Calle 1 # 2-3',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── TransactionStatus ─────────────────────────────────────────

export function makeTransactionStatus(
  overrides: Partial<TransactionStatus> = {},
): TransactionStatus {
  return TransactionStatus.fromPersistence({
    id: 1,
    name: 'PENDING',
    description: 'Awaiting processing',
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── Transaction ───────────────────────────────────────────────

export function makeTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return Transaction.fromPersistence({
    id: 1,
    customerId: 1,
    cut: null,
    transactionStatusId: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  });
}

// ── Delivery ──────────────────────────────────────────────────

export function makeDelivery(overrides: Partial<Delivery> = {}): Delivery {
  return Delivery.fromPersistence({
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
