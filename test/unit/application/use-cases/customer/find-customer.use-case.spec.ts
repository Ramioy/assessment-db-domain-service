// @ts-nocheck

import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { NotFoundError } from '@domain/errors';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockCustomerRepository } from '../../../../helpers/mock-repositories';
import { makeCustomer } from '../../../../helpers/entity-factory';

describe('FindCustomerUseCase', () => {
  let useCase: FindCustomerUseCase;
  let repo: ReturnType<typeof makeMockCustomerRepository>;

  beforeEach(() => {
    repo = makeMockCustomerRepository();
    useCase = new FindCustomerUseCase(repo);
  });

  it('returns the customer when found', async () => {
    const customer = makeCustomer({ id: 1 });
    repo.findById.mockResolvedValue(ok(customer));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(customer);
  });

  it('returns NotFoundError when customer does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
  });

  it('returns error with correct message', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(42);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Customer with id 42 not found');
  });

  it('propagates infrastructure error from repo.findById', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findById.mockResolvedValue(err(dbError));

    const result = await useCase.execute(1);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
