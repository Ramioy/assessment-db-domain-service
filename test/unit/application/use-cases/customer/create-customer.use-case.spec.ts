import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { AlreadyExistsException } from '@domain/exceptions/already-exists.exception';
import {
  makeMockCustomerRepository,
  makeMockCustomerDocumentTypeRepository,
} from '../../../../helpers/mock-repositories';
import { makeCustomer, makeCustomerDocumentType } from '../../../../helpers/entity-factory';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let customerRepo: ReturnType<typeof makeMockCustomerRepository>;
  let docTypeRepo: ReturnType<typeof makeMockCustomerDocumentTypeRepository>;

  const dto = {
    customerDocumentTypeId: 1,
    documentNumber: '123456789',
    email: 'john@example.com',
    contactPhone: null,
    address: null,
  };

  beforeEach(() => {
    customerRepo = makeMockCustomerRepository();
    docTypeRepo = makeMockCustomerDocumentTypeRepository();
    useCase = new CreateCustomerUseCase(customerRepo, docTypeRepo);
  });

  it('creates and returns a customer when all validations pass', async () => {
    docTypeRepo.findById.mockResolvedValue(makeCustomerDocumentType({ id: 1 }));
    customerRepo.findByEmail.mockResolvedValue(null);
    customerRepo.findByDocumentNumber.mockResolvedValue(null);
    const saved = makeCustomer(dto);
    customerRepo.save.mockResolvedValue(saved);

    const result = await useCase.execute(dto);

    expect(docTypeRepo.findById).toHaveBeenCalledWith(1);
    expect(customerRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(customerRepo.findByDocumentNumber).toHaveBeenCalledWith('123456789');
    expect(customerRepo.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(saved);
  });

  it('throws NotFoundException when document type does not exist', async () => {
    docTypeRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundException);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('throws AlreadyExistsException when email is already used', async () => {
    docTypeRepo.findById.mockResolvedValue(makeCustomerDocumentType());
    customerRepo.findByEmail.mockResolvedValue(makeCustomer());
    customerRepo.findByDocumentNumber.mockResolvedValue(null);

    await expect(useCase.execute(dto)).rejects.toThrow(AlreadyExistsException);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('throws AlreadyExistsException with email info', async () => {
    docTypeRepo.findById.mockResolvedValue(makeCustomerDocumentType());
    customerRepo.findByEmail.mockResolvedValue(makeCustomer());

    await expect(useCase.execute(dto)).rejects.toThrow(
      "Customer with email 'john@example.com' already exists",
    );
  });

  it('throws AlreadyExistsException when documentNumber is already used', async () => {
    docTypeRepo.findById.mockResolvedValue(makeCustomerDocumentType());
    customerRepo.findByEmail.mockResolvedValue(null);
    customerRepo.findByDocumentNumber.mockResolvedValue(makeCustomer());

    await expect(useCase.execute(dto)).rejects.toThrow(AlreadyExistsException);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });
});
