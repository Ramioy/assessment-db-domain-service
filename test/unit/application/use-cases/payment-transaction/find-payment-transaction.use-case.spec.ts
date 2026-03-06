// @ts-nocheck

import { FindPaymentTransactionUseCase } from '@application/use-cases/payment-transaction/find-payment-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockPaymentTransactionRepository } from '../../../../helpers/mock-repositories';
import { makePaymentTransaction } from '../../../../helpers/entity-factory';

describe('FindPaymentTransactionUseCase', () => {
  let useCase: FindPaymentTransactionUseCase;
  let repo: ReturnType<typeof makeMockPaymentTransactionRepository>;

  const ID = '11111111-2222-4333-8444-555555555555';
  const REFERENCE = 'ref-order-001';
  const PROVIDER_ID = 'prov-xyz-999';

  beforeEach(() => {
    repo = makeMockPaymentTransactionRepository();
    useCase = new FindPaymentTransactionUseCase(repo);
  });

  // ── execute (by ID) ──────────────────────────────────────────

  describe('execute() — find by ID', () => {
    it('returns the payment transaction when found', async () => {
      const pt = makePaymentTransaction({ id: ID });
      repo.findById.mockResolvedValue(ok(pt));

      const result = await useCase.execute(ID);

      expect(repo.findById).toHaveBeenCalledWith(ID);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(pt);
    });

    it('returns NotFoundError when not found', async () => {
      repo.findById.mockResolvedValue(ok(null));

      const result = await useCase.execute(ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    });

    it('returns NotFoundError with id in message', async () => {
      repo.findById.mockResolvedValue(ok(null));

      const result = await useCase.execute(ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toContain(ID);
    });

    it('propagates infrastructure error from findById', async () => {
      const dbError = new InfrastructureError('DB failure');
      repo.findById.mockResolvedValue(err(dbError));

      const result = await useCase.execute(ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe(dbError);
    });
  });

  // ── executeByReference ────────────────────────────────────────

  describe('executeByReference()', () => {
    it('returns the payment transaction when found by reference', async () => {
      const pt = makePaymentTransaction({ reference: REFERENCE });
      repo.findByReference.mockResolvedValue(ok(pt));

      const result = await useCase.executeByReference(REFERENCE);

      expect(repo.findByReference).toHaveBeenCalledWith(REFERENCE);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(pt);
    });

    it('returns NotFoundError when reference not found', async () => {
      repo.findByReference.mockResolvedValue(ok(null));

      const result = await useCase.executeByReference(REFERENCE);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    });

    it('returns NotFoundError with reference in message', async () => {
      repo.findByReference.mockResolvedValue(ok(null));

      const result = await useCase.executeByReference(REFERENCE);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toContain(REFERENCE);
    });

    it('propagates infrastructure error from findByReference', async () => {
      const dbError = new InfrastructureError('DB failure');
      repo.findByReference.mockResolvedValue(err(dbError));

      const result = await useCase.executeByReference(REFERENCE);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe(dbError);
    });
  });

  // ── executeByProviderId ───────────────────────────────────────

  describe('executeByProviderId()', () => {
    it('returns the payment transaction when found by providerId', async () => {
      const pt = makePaymentTransaction({ providerId: PROVIDER_ID });
      repo.findByProviderId.mockResolvedValue(ok(pt));

      const result = await useCase.executeByProviderId(PROVIDER_ID);

      expect(repo.findByProviderId).toHaveBeenCalledWith(PROVIDER_ID);
      expect(result.ok).toBe(true);
      if (result.ok) expect(result.value).toBe(pt);
    });

    it('returns NotFoundError when providerId not found', async () => {
      repo.findByProviderId.mockResolvedValue(ok(null));

      const result = await useCase.executeByProviderId(PROVIDER_ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    });

    it('returns NotFoundError with providerId in message', async () => {
      repo.findByProviderId.mockResolvedValue(ok(null));

      const result = await useCase.executeByProviderId(PROVIDER_ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.message).toContain(PROVIDER_ID);
    });

    it('propagates infrastructure error from findByProviderId', async () => {
      const dbError = new InfrastructureError('DB failure');
      repo.findByProviderId.mockResolvedValue(err(dbError));

      const result = await useCase.executeByProviderId(PROVIDER_ID);

      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error).toBe(dbError);
    });
  });
});
