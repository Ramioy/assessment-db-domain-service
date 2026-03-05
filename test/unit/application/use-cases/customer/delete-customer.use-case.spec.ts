import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(makeCustomer({ id: 1 }));
    repo.delete.mockResolvedValue(undefined);

    await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
  });

  it('throws NotFoundException when customer does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
    expect(repo.delete).not.toHaveBeenCalled();
  });
});
