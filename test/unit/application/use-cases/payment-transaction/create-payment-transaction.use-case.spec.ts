// @ts-nocheck

import { CreatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/create-payment-transaction.use-case';
import { AlreadyExistsError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockPaymentTransactionRepository } from '../../../../helpers/mock-repositories';
import { makePaymentTransaction } from '../../../../helpers/entity-factory';

describe('CreatePaymentTransactionUseCase', () => {
  let useCase: CreatePaymentTransactionUseCase;
  let repo: ReturnType<typeof makeMockPaymentTransactionRepository>;

  const dto = {
    id: '11111111-2222-4333-8444-555555555555',
    reference: 'ref-order-001',
    amountInCents: 10000,
    currency: 'COP',
    status: 'PENDING',
    paymentMethod: 'CARD',
    customerEmail: 'customer@example.com',
    signature: 'sig-abc123',
    providerId: null,
    statusMessage: null,
    customerIp: null,
    providerResponse: null,
  };

  beforeEach(() => {
    repo = makeMockPaymentTransactionRepository();
    useCase = new CreatePaymentTransactionUseCase(repo);
  });

  it('creates and returns a payment transaction when reference is unique', async () => {
    repo.findByReference.mockResolvedValue(ok(null));
    const saved = makePaymentTransaction();
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(repo.findByReference).toHaveBeenCalledWith('ref-order-001');
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns AlreadyExistsError when reference already exists', async () => {
    repo.findByReference.mockResolvedValue(ok(makePaymentTransaction()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(AlreadyExistsError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('returns AlreadyExistsError with correct message', async () => {
    repo.findByReference.mockResolvedValue(ok(makePaymentTransaction()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.message).toBe(
        "PaymentTransaction with reference 'ref-order-001' already exists",
      );
  });

  it('propagates infrastructure error from findByReference', async () => {
    const dbError = new InfrastructureError('DB connection failed');
    repo.findByReference.mockResolvedValue(err(dbError));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from save', async () => {
    const dbError = new InfrastructureError('Insert failed');
    repo.findByReference.mockResolvedValue(ok(null));
    repo.save.mockResolvedValue(err(dbError));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });

  it('passes the entity with caller-supplied UUID to save', async () => {
    repo.findByReference.mockResolvedValue(ok(null));
    repo.save.mockResolvedValue(ok(makePaymentTransaction()));

    await useCase.execute(dto);

    const savedEntity = repo.save.mock.calls[0][0];
    expect(savedEntity.id).toBe('11111111-2222-4333-8444-555555555555');
    expect(savedEntity.reference).toBe('ref-order-001');
    expect(savedEntity.status).toBe('PENDING');
  });
});
