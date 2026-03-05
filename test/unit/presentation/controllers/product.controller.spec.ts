import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '@presentation/controllers/product.controller';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { FindAllProductsUseCase } from '@application/use-cases/product/find-all-products.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { ok } from '@shared/result';
import { makeProduct } from '../../../helpers/entity-factory';

describe('ProductController', () => {
  let controller: ProductController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: CreateProductUseCase, useValue: mockCreate },
        { provide: FindProductUseCase, useValue: mockFind },
        { provide: FindAllProductsUseCase, useValue: mockFindAll },
        { provide: UpdateProductUseCase, useValue: mockUpdate },
        { provide: DeleteProductUseCase, useValue: mockDelete },
      ],
    }).compile();

    controller = module.get(ProductController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('delegates to createUseCase', async () => {
      const dto = { name: 'Laptop', categoryId: 1, description: null, imageUrl: null };
      const saved = makeProduct(dto);
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('calls findAll without categoryId filter', async () => {
      const products = [makeProduct()];
      mockFindAll.execute.mockResolvedValue(ok(products));

      const result = await controller.findAll(undefined);

      expect(mockFindAll.execute).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(products);
    });

    it('parses categoryId string to number and filters', async () => {
      const products = [makeProduct({ categoryId: 2 })];
      mockFindAll.execute.mockResolvedValue(ok(products));

      const result = await controller.findAll('2');

      expect(mockFindAll.execute).toHaveBeenCalledWith(2);
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('delegates to findUseCase', async () => {
      const product = makeProduct({ id: 1 });
      mockFind.execute.mockResolvedValue(ok(product));

      const result = await controller.findOne(1);

      expect(mockFind.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(product);
    });
  });

  describe('update', () => {
    it('delegates to updateUseCase', async () => {
      const dto = { name: 'Updated' };
      const updated = makeProduct({ name: 'Updated' });
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
