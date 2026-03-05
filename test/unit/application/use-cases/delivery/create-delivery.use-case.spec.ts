import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { NotFoundError } from '@domain/errors';
import { ok } from '@shared/result';
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
    customerRepo.findById.mockResolvedValue(ok(makeCustomer({ id: 1 })));
    transactionRepo.findById.mockResolvedValue(ok(makeTransaction({ id: 1 })));
    const saved = makeDelivery(dto);
    deliveryRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(customerRepo.findById).toHaveBeenCalledWith(1);
    expect(transactionRepo.findById).toHaveBeenCalledWith(1);
    expect(deliveryRepo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns NotFoundError when customer does not exist', async () => {
    customerRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(deliveryRepo.save).not.toHaveBeenCalled();
  });

  it('returns NotFoundError when transaction does not exist', async () => {
    customerRepo.findById.mockResolvedValue(ok(makeCustomer()));
    transactionRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(deliveryRepo.save).not.toHaveBeenCalled();
  });

  it('returns error with correct message for missing customer', async () => {
    customerRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Customer with id 1 not found');
  });

  it('returns error with correct message for missing transaction', async () => {
    customerRepo.findById.mockResolvedValue(ok(makeCustomer()));
    transactionRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.message).toBe('Transaction with id 1 not found');
  });
});
