// @ts-nocheck
/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from '@presentation/controllers/delivery.controller';
import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';
import { ok } from '@shared/result';
import { makeDelivery } from '../../../helpers/entity-factory';

describe('DeliveryController', () => {
  let controller: DeliveryController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        { provide: CreateDeliveryUseCase, useValue: mockCreate },
        { provide: FindDeliveryUseCase, useValue: mockFind },
        { provide: FindAllDeliveriesUseCase, useValue: mockFindAll },
      ],
    }).compile();

    controller = module.get(DeliveryController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('delegates to createUseCase', async () => {
      const dto = { customerId: 1, transactionId: 1, customerAddressId: null };
      const saved = makeDelivery(dto);
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('returns all deliveries when no filters given', async () => {
      const deliveries = [makeDelivery()];
      mockFindAll.execute.mockResolvedValue(ok(deliveries));

      const result = await controller.findAll(undefined, undefined);

      expect(mockFindAll.execute).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(deliveries);
    });

    it('parses transactionId string to number', async () => {
      mockFindAll.execute.mockResolvedValue(ok([]));

      await controller.findAll('10', undefined);

      expect(mockFindAll.execute).toHaveBeenCalledWith(10, undefined);
    });

    it('parses customerId string to number', async () => {
      mockFindAll.execute.mockResolvedValue(ok([]));

      await controller.findAll(undefined, '3');

      expect(mockFindAll.execute).toHaveBeenCalledWith(undefined, 3);
    });

    it('parses both filters when both are provided', async () => {
      mockFindAll.execute.mockResolvedValue(ok([]));

      await controller.findAll('5', '2');

      expect(mockFindAll.execute).toHaveBeenCalledWith(5, 2);
    });
  });

  describe('findOne', () => {
    it('delegates to findUseCase with id', async () => {
      const delivery = makeDelivery({ id: 1 });
      mockFind.execute.mockResolvedValue(ok(delivery));

      const result = await controller.findOne(1);

      expect(mockFind.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(delivery);
    });
  });
});
