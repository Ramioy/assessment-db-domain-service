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

import type { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import type { IProductRepository } from '@application/ports/out/product-repository.port';
import type { IStockRepository } from '@application/ports/out/stock-repository.port';
import type { ICustomerDocumentTypeRepository } from '@application/ports/out/customer-document-type-repository.port';
import type { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import type { ITransactionStatusRepository } from '@application/ports/out/transaction-status-repository.port';
import type { ITransactionRepository } from '@application/ports/out/transaction-repository.port';
import type { IDeliveryRepository } from '@application/ports/out/delivery-repository.port';

// Helper type: turn every method into a jest.Mock
type Mocked<T> = { [K in keyof T]: jest.Mock };

// ── ProductCategory ───────────────────────────────────────────

export function makeMockProductCategoryRepository(): Mocked<IProductCategoryRepository> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    findByName: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Product ───────────────────────────────────────────────────

export function makeMockProductRepository(): Mocked<IProductRepository> {
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

export function makeMockStockRepository(): Mocked<IStockRepository> {
  return {
    findById: jest.fn(),
    findByProductId: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── CustomerDocumentType ──────────────────────────────────────

export function makeMockCustomerDocumentTypeRepository(): Mocked<ICustomerDocumentTypeRepository> {
  return {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Customer ──────────────────────────────────────────────────

export function makeMockCustomerRepository(): Mocked<ICustomerRepository> {
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

export function makeMockTransactionStatusRepository(): Mocked<ITransactionStatusRepository> {
  return {
    findById: jest.fn(),
    findByName: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Transaction ───────────────────────────────────────────────

export function makeMockTransactionRepository(): Mocked<ITransactionRepository> {
  return {
    findById: jest.fn(),
    findByCustomerId: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
}

// ── Delivery ──────────────────────────────────────────────────

export function makeMockDeliveryRepository(): Mocked<IDeliveryRepository> {
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
