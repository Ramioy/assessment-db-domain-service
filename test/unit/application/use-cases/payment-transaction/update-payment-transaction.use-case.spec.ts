// @ts-nocheck

import { UpdatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/update-payment-transaction.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockPaymentTransactionRepository } from '../../../../helpers/mock-repositories';
import { makePaymentTransaction } from '../../../../helpers/entity-factory';

describe('UpdatePaymentTransactionUseCase', () => {
  let useCase: UpdatePaymentTransactionUseCase;
  let repo: ReturnType<typeof makeMockPaymentTransactionRepository>;

  const ID = '11111111-2222-4333-8444-555555555555';
  const updateDto = { status: 'APPROVED', providerId: 'prov-999', statusMessage: 'OK' };

  beforeEach(() => {
    repo = makeMockPaymentTransactionRepository();
    useCase = new UpdatePaymentTransactionUseCase(repo);
  });

  it('finds the transaction, applies update, and saves', async () => {
    const original = makePaymentTransaction({ id: ID, status: 'PENDING' });
    const updated = original.applyStatusUpdate(updateDto);
    repo.findById.mockResolvedValue(ok(original));
    repo.save.mockResolvedValue(ok(updated));

    const result = await useCase.execute(ID, updateDto);

    expect(repo.findById).toHaveBeenCalledWith(ID);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(updated);
  });

  it('saves the entity with updated status', async () => {
    const original = makePaymentTransaction({ id: ID, status: 'PENDING' });
    repo.findById.mockResolvedValue(ok(original));
    repo.save.mockImplementation(async (entity) => ok(entity));

    const result = await useCase.execute(ID, { status: 'DECLINED' });

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.status).toBe('DECLINED');
  });

  it('returns NotFoundError when transaction does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(ID, updateDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('returns NotFoundError with id in message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(ID, updateDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toContain(ID);
  });

  it('propagates infrastructure error from findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(ID, updateDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from save', async () => {
    const dbError = new InfrastructureError('Update failed');
    repo.findById.mockResolvedValue(ok(makePaymentTransaction({ id: ID })));
    repo.save.mockResolvedValue(err(dbError));

    const result = await useCase.execute(ID, updateDto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });

  it('preserves immutable fields after status update', async () => {
    const original = makePaymentTransaction({ id: ID, amountInCents: 50000, reference: 'ref-x' });
    repo.findById.mockResolvedValue(ok(original));
    repo.save.mockImplementation(async (entity) => ok(entity));

    const result = await useCase.execute(ID, { status: 'APPROVED' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.amountInCents).toBe(50000);
      expect(result.value.reference).toBe('ref-x');
      expect(result.value.id).toBe(ID);
    }
  });
});
