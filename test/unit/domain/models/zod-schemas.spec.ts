// @ts-nocheck

/**
 * Zod Schema tests – validates that domain model schemas accept
 * valid data and reject invalid data with proper error shapes.
 */

import {
  createProductCategorySchema,
  updateProductCategorySchema,
} from '@domain/models/product-category.entity';
import { createProductSchema, updateProductSchema } from '@domain/models/product.entity';
import { createStockSchema, updateStockSchema } from '@domain/models/stock.entity';
import { createCustomerSchema } from '@domain/models/customer.entity';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '@domain/models/transaction.entity';
import { createDeliverySchema } from '@domain/models/delivery.entity';
import {
  createPaymentTransactionSchema,
  updatePaymentTransactionSchema,
} from '@domain/models/payment-transaction.entity';

// ── Helpers ───────────────────────────────────────────────────

function expectValid<T>(
  schema: { safeParse: (v: unknown) => { success: boolean; data?: T } },
  value: unknown,
) {
  const result = schema.safeParse(value);
  expect(result.success).toBe(true);
}

function expectInvalid(
  schema: { safeParse: (v: unknown) => { success: boolean } },
  value: unknown,
) {
  const result = schema.safeParse(value);
  expect(result.success).toBe(false);
}

// ── ProductCategory ───────────────────────────────────────────

describe('ProductCategory Zod schemas', () => {
  describe('createProductCategorySchema', () => {
    it('accepts valid data', () => {
      expectValid(createProductCategorySchema, { name: 'Electronics', description: 'Devices' });
    });

    it('accepts null description', () => {
      expectValid(createProductCategorySchema, { name: 'Electronics', description: null });
    });

    it('accepts missing description (optional)', () => {
      expectValid(createProductCategorySchema, { name: 'Electronics' });
    });

    it('rejects empty name', () => {
      expectInvalid(createProductCategorySchema, { name: '' });
    });

    it('rejects name exceeding 255 chars', () => {
      expectInvalid(createProductCategorySchema, { name: 'a'.repeat(256) });
    });

    it('rejects missing name', () => {
      expectInvalid(createProductCategorySchema, { description: 'x' });
    });
  });

  describe('updateProductCategorySchema', () => {
    it('accepts partial update with name only', () => {
      expectValid(updateProductCategorySchema, { name: 'Updated' });
    });

    it('accepts partial update with description only', () => {
      expectValid(updateProductCategorySchema, { description: 'new desc' });
    });

    it('accepts empty object (all fields optional)', () => {
      expectValid(updateProductCategorySchema, {});
    });

    it('rejects empty name when provided', () => {
      expectInvalid(updateProductCategorySchema, { name: '' });
    });
  });
});

// ── Product ───────────────────────────────────────────────────

describe('Product Zod schemas', () => {
  const validProduct = { name: 'Laptop', categoryId: 1 };

  describe('createProductSchema', () => {
    it('accepts minimal valid data', () => {
      expectValid(createProductSchema, validProduct);
    });

    it('accepts full valid data', () => {
      expectValid(createProductSchema, {
        name: 'Laptop Pro',
        description: 'Great laptop',
        imageUrl: 'https://example.com/img.png',
        categoryId: 2,
      });
    });

    it('rejects empty name', () => {
      expectInvalid(createProductSchema, { ...validProduct, name: '' });
    });

    it('rejects non-positive categoryId', () => {
      expectInvalid(createProductSchema, { ...validProduct, categoryId: 0 });
    });

    it('rejects invalid imageUrl', () => {
      expectInvalid(createProductSchema, { ...validProduct, imageUrl: 'not-a-url' });
    });
  });

  describe('updateProductSchema', () => {
    it('accepts partial update', () => {
      expectValid(updateProductSchema, { name: 'New Name' });
    });

    it('accepts empty object', () => {
      expectValid(updateProductSchema, {});
    });
  });
});

// ── Stock ─────────────────────────────────────────────────────

describe('Stock Zod schemas', () => {
  describe('createStockSchema', () => {
    it('accepts valid data', () => {
      expectValid(createStockSchema, { productId: 1, quantity: 10 });
    });

    it('accepts zero quantity', () => {
      expectValid(createStockSchema, { productId: 1, quantity: 0 });
    });

    it('rejects negative quantity', () => {
      expectInvalid(createStockSchema, { productId: 1, quantity: -1 });
    });

    it('rejects non-positive productId', () => {
      expectInvalid(createStockSchema, { productId: 0, quantity: 5 });
    });
  });

  describe('updateStockSchema', () => {
    it('accepts partial update', () => {
      expectValid(updateStockSchema, { quantity: 99 });
    });

    it('rejects negative quantity when provided', () => {
      expectInvalid(updateStockSchema, { quantity: -5 });
    });
  });
});

// ── Customer ──────────────────────────────────────────────────

describe('Customer Zod schemas', () => {
  const validCustomer = {
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'test@example.com',
  };

  describe('createCustomerSchema', () => {
    it('accepts minimal valid data', () => {
      expectValid(createCustomerSchema, validCustomer);
    });

    it('accepts full valid data', () => {
      expectValid(createCustomerSchema, {
        ...validCustomer,
        contactPhone: '+57 300 000 0000',
        address: 'Calle 1 # 2-3',
      });
    });

    it('rejects invalid email', () => {
      expectInvalid(createCustomerSchema, { ...validCustomer, email: 'not-an-email' });
    });

    it('rejects empty documentNumber', () => {
      expectInvalid(createCustomerSchema, { ...validCustomer, documentNumber: '' });
    });

    it('rejects non-positive customerDocumentTypeId', () => {
      expectInvalid(createCustomerSchema, { ...validCustomer, customerDocumentTypeId: 0 });
    });
  });
});

// ── Transaction ───────────────────────────────────────────────

describe('Transaction Zod schemas', () => {
  const validTx = { customerId: 1, transactionStatusId: 1 };

  describe('createTransactionSchema', () => {
    it('accepts minimal valid data', () => {
      expectValid(createTransactionSchema, validTx);
    });

    it('accepts data with cut', () => {
      expectValid(createTransactionSchema, { ...validTx, cut: 'CUT-001' });
    });

    it('rejects non-positive customerId', () => {
      expectInvalid(createTransactionSchema, { ...validTx, customerId: 0 });
    });

    it('rejects non-positive transactionStatusId', () => {
      expectInvalid(createTransactionSchema, { ...validTx, transactionStatusId: -1 });
    });
  });

  describe('updateTransactionSchema', () => {
    it('accepts partial update', () => {
      expectValid(updateTransactionSchema, { transactionStatusId: 2 });
    });

    it('accepts empty object', () => {
      expectValid(updateTransactionSchema, {});
    });
  });
});

// ── Delivery ──────────────────────────────────────────────────

describe('Delivery Zod schemas', () => {
  const validDelivery = { customerId: 1, transactionId: 1 };

  describe('createDeliverySchema', () => {
    it('accepts minimal valid data', () => {
      expectValid(createDeliverySchema, validDelivery);
    });

    it('accepts data with customerAddressId', () => {
      expectValid(createDeliverySchema, { ...validDelivery, customerAddressId: 5 });
    });

    it('accepts null customerAddressId', () => {
      expectValid(createDeliverySchema, { ...validDelivery, customerAddressId: null });
    });

    it('rejects non-positive customerId', () => {
      expectInvalid(createDeliverySchema, { ...validDelivery, customerId: 0 });
    });

    it('rejects non-positive transactionId', () => {
      expectInvalid(createDeliverySchema, { ...validDelivery, transactionId: -1 });
    });
  });
});

// ── PaymentTransaction ────────────────────────────────────────

describe('PaymentTransaction Zod schemas', () => {
  const validCreate = {
    id: '11111111-2222-4333-8444-555555555555',
    providerId: null,
    reference: 'ref-order-001',
    amountInCents: 10000,
    currency: 'COP',
    status: 'PENDING',
    statusMessage: null,
    paymentMethod: 'CARD',
    customerEmail: 'customer@example.com',
    customerIp: null,
    signature: 'sig-abc123',
    providerResponse: null,
  };

  describe('createPaymentTransactionSchema', () => {
    it('accepts valid full data', () => {
      expectValid(createPaymentTransactionSchema, validCreate);
    });

    it('accepts data with providerResponse object', () => {
      expectValid(createPaymentTransactionSchema, {
        ...validCreate,
        providerId: 'prov-123',
        providerResponse: { code: '200', message: 'OK' },
      });
    });

    it('accepts customerIp when provided', () => {
      expectValid(createPaymentTransactionSchema, { ...validCreate, customerIp: '10.0.0.1' });
    });

    it('rejects invalid UUID for id', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, id: 'not-a-uuid' });
    });

    it('rejects empty reference', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, reference: '' });
    });

    it('rejects reference exceeding 255 chars', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, reference: 'a'.repeat(256) });
    });

    it('rejects non-positive amountInCents', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, amountInCents: 0 });
    });

    it('rejects negative amountInCents', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, amountInCents: -100 });
    });

    it('rejects non-integer amountInCents', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, amountInCents: 10.5 });
    });

    it('rejects currency not exactly 3 chars', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, currency: 'CO' });
    });

    it('rejects empty status', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, status: '' });
    });

    it('rejects empty paymentMethod', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, paymentMethod: '' });
    });

    it('rejects invalid customerEmail', () => {
      expectInvalid(createPaymentTransactionSchema, {
        ...validCreate,
        customerEmail: 'not-an-email',
      });
    });

    it('rejects empty signature', () => {
      expectInvalid(createPaymentTransactionSchema, { ...validCreate, signature: '' });
    });

    it('rejects statusMessage exceeding 500 chars', () => {
      expectInvalid(createPaymentTransactionSchema, {
        ...validCreate,
        statusMessage: 'x'.repeat(501),
      });
    });

    it('rejects customerIp exceeding 45 chars', () => {
      expectInvalid(createPaymentTransactionSchema, {
        ...validCreate,
        customerIp: 'x'.repeat(46),
      });
    });
  });

  describe('updatePaymentTransactionSchema', () => {
    it('accepts empty object (all fields optional)', () => {
      expectValid(updatePaymentTransactionSchema, {});
    });

    it('accepts status-only update', () => {
      expectValid(updatePaymentTransactionSchema, { status: 'APPROVED' });
    });

    it('accepts providerId update', () => {
      expectValid(updatePaymentTransactionSchema, { providerId: 'prov-xyz' });
    });

    it('accepts null providerId', () => {
      expectValid(updatePaymentTransactionSchema, { providerId: null });
    });

    it('accepts statusMessage update', () => {
      expectValid(updatePaymentTransactionSchema, { statusMessage: 'Approved' });
    });

    it('accepts null statusMessage', () => {
      expectValid(updatePaymentTransactionSchema, { statusMessage: null });
    });

    it('accepts providerResponse update', () => {
      expectValid(updatePaymentTransactionSchema, { providerResponse: { code: '200' } });
    });

    it('accepts full update with all optional fields', () => {
      expectValid(updatePaymentTransactionSchema, {
        providerId: 'prov-1',
        status: 'DECLINED',
        statusMessage: 'Insufficient funds',
        providerResponse: { error: 'insufficient_funds' },
      });
    });

    it('rejects empty status when provided', () => {
      expectInvalid(updatePaymentTransactionSchema, { status: '' });
    });
  });
});
