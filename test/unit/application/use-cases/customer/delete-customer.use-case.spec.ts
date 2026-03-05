// @ts-nocheck
/* eslint-disable */
import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
import { makeMockCustomerRepository } from '../../../../helpers/mock-repositories';
import { makeCustomer } from '../../../../helpers/entity-factory';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
  let repo: ReturnType<typeof makeMockCustomerRepository>;

  beforeEach(() => {
    repo = makeMockCustomerRepository();
    useCase = new DeleteCustomerUseCase(repo);
  });

  it('deletes the customer when it exists', async () => {
    repo.findById.mockResolvedValue(ok(makeCustomer({ id: 1 })));
    repo.delete.mockResolvedValue(ok(undefined));

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result.ok).toBe(true);
  });

  it('returns NotFoundError when customer does not exist', async () => {
    repo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(99);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
