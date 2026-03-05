/**
 * Mock Repository Factories
 * ─────────────────────────────────────────────────────────────
 * Returns jest.fn() mocks for every method declared in each
 * repository port interface. Import the factory in your test
 * file and inject the result as the provider value.
 *
 * Usage:
 *   const repo = makeMockProductCategoryRepository();
 *   repo.findById.mockResolvedValue(someCategory);
 */

import type { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import type { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import type { StockRepositoryPort } from '@application/ports/out/stock-repository.port';
import type { CustomerDocumentTypeRepositoryPort } from '@application/ports/out/customer-document-type-repository.port';
import type { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import type { TransactionStatusRepositoryPort } from '@application/ports/out/transaction-status-repository.port';
import type { TransactionRepositoryPort } from '@application/ports/out/transaction-repository.port';
import type { DeliveryRepositoryPort } from '@application/ports/out/delivery-repository.port';

// Helper type: turn every method into a jest.Mock
type Mocked<T> = { [K in keyof T]: jest.Mock };

// ── ProductCategory ───────────────────────────────────────────

export function makeMockProductCategoryRepository(): Mocked<ProductCategoryRepositoryPort> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Product ───────────────────────────────────────────────────

export function makeMockProductRepository(): Mocked<ProductRepositoryPort> {
  return {
    findById: jest.fn(),
    findByUuid: jest.fn(),
    findAll: jest.fn(),
    findByCategoryId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Stock ─────────────────────────────────────────────────────

export function makeMockStockRepository(): Mocked<StockRepositoryPort> {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByProductId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── CustomerDocumentType ──────────────────────────────────────

export function makeMockCustomerDocumentTypeRepository(): Mocked<CustomerDocumentTypeRepositoryPort> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Customer ──────────────────────────────────────────────────

export function makeMockCustomerRepository(): Mocked<CustomerRepositoryPort> {
  return {
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByDocumentNumber: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── TransactionStatus ─────────────────────────────────────────

export function makeMockTransactionStatusRepository(): Mocked<TransactionStatusRepositoryPort> {
  return {
    findById: jest.fn(),
    findByName: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Transaction ───────────────────────────────────────────────

export function makeMockTransactionRepository(): Mocked<TransactionRepositoryPort> {
  return {
    findById: jest.fn(),
    findByCustomerId: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Delivery ──────────────────────────────────────────────────

export function makeMockDeliveryRepository(): Mocked<DeliveryRepositoryPort> {
  return {
    findById: jest.fn(),
    findByUuid: jest.fn(),
    findByTransactionId: jest.fn(),
    findByCustomerId: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}
