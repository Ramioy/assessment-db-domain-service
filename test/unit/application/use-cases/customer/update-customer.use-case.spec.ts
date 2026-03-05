import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
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
    repo.findById.mockResolvedValue(existing);
    repo.save.mockResolvedValue(saved);

    const result = await useCase.execute(1, dto);

    expect(repo.findById).toHaveBeenCalledWith(1);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('merges partial dto onto entity', async () => {
    const existing = makeCustomer({ id: 1, address: 'Old address', contactPhone: '+57 300' });
    const dto = { address: 'New address' };
    repo.findById.mockResolvedValue(existing);
    repo.save.mockImplementation(async (e) => e);

    const result = await useCase.execute(1, dto);

    expect(result.address).toBe('New address');
    expect(result.contactPhone).toBe('+57 300');
  });

  it('throws NotFoundException when customer does not exist', async () => {
    repo.findById.mockResolvedValue(null);

    await expect(useCase.execute(99, {})).rejects.toThrow(NotFoundException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
