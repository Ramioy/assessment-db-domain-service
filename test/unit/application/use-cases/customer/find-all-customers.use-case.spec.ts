import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
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
    const customers = [makeCustomer({ id: 1 }), makeCustomer({ id: 2, email: 'b@b.com', documentNumber: '999' })];
    repo.findAll.mockResolvedValue(customers);

    const result = await useCase.execute();

    expect(repo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(customers);
  });

  it('returns empty array when no customers exist', async () => {
    repo.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
