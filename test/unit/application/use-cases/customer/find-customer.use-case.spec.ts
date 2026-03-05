import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(customer);

    const result = await useCase.execute(1);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(result).toBe(customer);
  });

  it('throws NotFoundException when customer does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99)).rejects.toThrow(NotFoundException);
  });

  it('throws with correct message', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(42)).rejects.toThrow('Customer with id 42 not found');
  });
});
