// @ts-nocheck

import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockCustomerRepository } from '../../../../helpers/mock-repositories';
import { makeCustomer } from '../../../../helpers/entity-factory';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
  let repo: ReturnType<typeof makeMockCustomerRepository>;

  beforeEach(() => {
    repo = makeMockCustomerRepository();
    useCase = new UpdateCustomerUseCase(repo);
  });

  it('updates and returns the customer', async () => {
    const existing = makeCustomer({ id: 1, contactPhone: null });
    const dto = { contactPhone: '+57 300 111 2222' };
    const saved = makeCustomer({ id: 1, contactPhone: '+57 300 111 2222' });
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeCustomer({ id: 1, address: 'Old address', contactPhone: '+57 300' });
    const dto = { address: 'New address' };
    repo.findById.mockResolvedValue(ok(existing));
    repo.save.mockImplementation((e) => Promise.resolve(ok(e)));

    const result = await useCase.execute(1, dto);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.address).toBe('New address');
      expect(result.value.contactPhone).toBe('+57 300');
    }
  });

  it('returns NotFoundError when customer does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('propagates infrastructure error from repo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1, {});

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
