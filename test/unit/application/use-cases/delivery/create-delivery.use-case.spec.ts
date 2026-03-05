import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import {
  makeMockDeliveryRepository,
  makeMockCustomerRepository,
  makeMockTransactionRepository,
} from '../../../../helpers/mock-repositories';
import { makeCustomer, makeDelivery, makeTransaction } from '../../../../helpers/entity-factory';

describe('CreateDeliveryUseCase', () => {
  let useCase: CreateDeliveryUseCase;
  let deliveryRepo: ReturnType<typeof makeMockDeliveryRepository>;
  let customerRepo: ReturnType<typeof makeMockCustomerRepository>;
  let transactionRepo: ReturnType<typeof makeMockTransactionRepository>;

  const dto = { customerId: 1, transactionId: 1, customerAddressId: null };

  beforeEach(() => {
    deliveryRepo = makeMockDeliveryRepository();
    customerRepo = makeMockCustomerRepository();
    transactionRepo = makeMockTransactionRepository();
    useCase = new CreateDeliveryUseCase(deliveryRepo, customerRepo, transactionRepo);
  });

  it('creates and returns a delivery when all validations pass', async () => {
    customerRepo.findById.mockResolvedValue(makeCustomer({ id: 1 }));
    transactionRepo.findById.mockResolvedValue(makeTransaction({ id: 1 }));
    const saved = makeDelivery(dto);
    deliveryRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(1);
    expect(transactionRepo.findById).toHaveBeenCalledWith(1);
    expect(deliveryRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('throws NotFoundException when customer does not exist', async () => {
    customerRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(deliveryRepo.save).not.toHaveBeenCalled();
  });

  it('throws NotFoundException when transaction does not exist', async () => {
    customerRepo.findById.mockResolvedValue(makeCustomer());
    transactionRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(deliveryRepo.save).not.toHaveBeenCalled();
  });

  it('throws with correct message for missing customer', async () => {
    customerRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow('Customer with id 1 not found');
  });

  it('throws with correct message for missing transaction', async () => {
    customerRepo.findById.mockResolvedValue(makeCustomer());
    transactionRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow('Transaction with id 1 not found');
  });
});
