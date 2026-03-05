// @ts-nocheck
/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from '@presentation/controllers/customer.controller';
import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { ok } from '@shared/result';
import { makeCustomer } from '../../../helpers/entity-factory';

describe('CustomerController', () => {
  let controller: CustomerController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CreateCustomerUseCase, useValue: mockCreate },
        { provide: FindCustomerUseCase, useValue: mockFind },
        { provide: FindAllCustomersUseCase, useValue: mockFindAll },
        { provide: UpdateCustomerUseCase, useValue: mockUpdate },
        { provide: DeleteCustomerUseCase, useValue: mockDelete },
      ],
    }).compile();

    controller = module.get(CustomerController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('delegates to createUseCase', async () => {
      const dto = {
        customerDocumentTypeId: 1,
        documentNumber: '123',
        email: 'a@b.com',
        contactPhone: null,
        address: null,
      };
      const saved = makeCustomer(dto);
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('returns all customers', async () => {
      const customers = [makeCustomer()];
      mockFindAll.execute.mockResolvedValue(ok(customers));

      const result = await controller.findAll();

      expect(mockFindAll.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(customers);
    });
  });

  describe('findOne', () => {
    it('delegates to findUseCase with id', async () => {
      const customer = makeCustomer({ id: 1 });
      mockFind.execute.mockResolvedValue(ok(customer));

      const result = await controller.findOne(1);

      expect(mockFind.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(customer);
    });
  });

  describe('update', () => {
    it('delegates to updateUseCase', async () => {
      const dto = { address: 'New address' };
      const updated = makeCustomer({ address: 'New address' });
      mockUpdate.execute.mockResolvedValue(ok(updated));

      const result = await controller.update(1, dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('delegates to deleteUseCase', async () => {
      mockDelete.execute.mockResolvedValue(ok(undefined));

      await controller.remove(1);

      expect(mockDelete.execute).toHaveBeenCalledWith(1);
    });
  });
});
