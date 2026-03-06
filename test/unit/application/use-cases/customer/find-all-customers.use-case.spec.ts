// @ts-nocheck

import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
import { InfrastructureError } from '@shared/errors';
import { ok, err } from '@shared/result';
import { makeMockCustomerRepository } from '../../../../helpers/mock-repositories';
import { makeCustomer } from '../../../../helpers/entity-factory';

describe('FindAllCustomersUseCase', () => {
  let useCase: FindAllCustomersUseCase;
  let repo: ReturnType<typeof makeMockCustomerRepository>;

  beforeEach(() => {
    repo = makeMockCustomerRepository();
    useCase = new FindAllCustomersUseCase(repo);
  });

  it('returns all customers', async () => {
    const customers = [
      makeCustomer({ id: 1 }),
      makeCustomer({ id: 2, email: 'b@b.com', documentNumber: '999' }),
    ];
    repo.findAll.mockResolvedValue(ok(customers));

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual(customers);
  });

  it('returns empty array when no customers exist', async () => {
    repo.findAll.mockResolvedValue(ok([]));

    const result = await useCase.execute();

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toEqual([]);
  });

  it('propagates infrastructure error from repo.findAll', async () => {
    const dbError = new InfrastructureError('DB failure');
    repo.findAll.mockResolvedValue(err(dbError));

    const result = await useCase.execute();

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe(dbError);
  });
});
