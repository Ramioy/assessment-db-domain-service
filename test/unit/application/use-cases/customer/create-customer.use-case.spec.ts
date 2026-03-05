// @ts-nocheck
/* eslint-disable */
import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { NotFoundError, AlreadyExistsError } from '@domain/errors';
import { ok } from '@shared/result';
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
    docTypeRepo.findById.mockResolvedValue(ok(makeCustomerDocumentType({ id: 1 })));
    customerRepo.findByEmail.mockResolvedValue(ok(null));
    customerRepo.findByDocumentNumber.mockResolvedValue(ok(null));
    const saved = makeCustomer(dto);
    customerRepo.save.mockResolvedValue(ok(saved));

    const result = await useCase.execute(dto);

    expect(docTypeRepo.findById).toHaveBeenCalledWith(1);
    expect(customerRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(customerRepo.findByDocumentNumber).toHaveBeenCalledWith('123456789');
    expect(customerRepo.save).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe(saved);
  });

  it('returns NotFoundError when document type does not exist', async () => {
    docTypeRepo.findById.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(NotFoundError);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('returns AlreadyExistsError when email is already used', async () => {
    docTypeRepo.findById.mockResolvedValue(ok(makeCustomerDocumentType()));
    customerRepo.findByEmail.mockResolvedValue(ok(makeCustomer()));
    customerRepo.findByDocumentNumber.mockResolvedValue(ok(null));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(AlreadyExistsError);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });

  it('returns AlreadyExistsError with email info', async () => {
    docTypeRepo.findById.mockResolvedValue(ok(makeCustomerDocumentType()));
    customerRepo.findByEmail.mockResolvedValue(ok(makeCustomer()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain("email 'john@example.com' already exists");
    }
  });

  it('returns AlreadyExistsError when documentNumber is already used', async () => {
    docTypeRepo.findById.mockResolvedValue(ok(makeCustomerDocumentType()));
    customerRepo.findByEmail.mockResolvedValue(ok(null));
    customerRepo.findByDocumentNumber.mockResolvedValue(ok(makeCustomer()));

    const result = await useCase.execute(dto);

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBeInstanceOf(AlreadyExistsError);
    expect(customerRepo.save).not.toHaveBeenCalled();
  });
});
