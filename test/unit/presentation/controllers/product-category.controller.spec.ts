import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoryController } from '@presentation/controllers/product-category.controller';
import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';
import { ok } from '@shared/result';
import { makeProductCategory } from '../../../helpers/entity-factory';

describe('ProductCategoryController', () => {
  let controller: ProductCategoryController;

  const mockCreate = { execute: jest.fn() };
  const mockFind = { execute: jest.fn() };
  const mockFindAll = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };
  const mockDelete = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoryController],
      providers: [
        { provide: CreateProductCategoryUseCase, useValue: mockCreate },
        { provide: FindProductCategoryUseCase, useValue: mockFind },
        { provide: FindAllProductCategoriesUseCase, useValue: mockFindAll },
        { provide: UpdateProductCategoryUseCase, useValue: mockUpdate },
        { provide: DeleteProductCategoryUseCase, useValue: mockDelete },
      ],
    }).compile();

    controller = module.get(ProductCategoryController);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('calls createUseCase.execute with dto and returns result', async () => {
      const dto = { name: 'Electronics', description: null };
      const saved = makeProductCategory(dto);
      mockCreate.execute.mockResolvedValue(ok(saved));

      const result = await controller.create(dto);

      expect(mockCreate.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(saved);
    });
  });

  describe('findAll', () => {
    it('calls findAllUseCase.execute and returns result', async () => {
      const cats = [makeProductCategory()];
      mockFindAll.execute.mockResolvedValue(ok(cats));

      const result = await controller.findAll();

      expect(mockFindAll.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(cats);
    });
  });

  describe('findOne', () => {
    it('calls findUseCase.execute with id and returns result', async () => {
      const cat = makeProductCategory({ id: 1 });
      mockFind.execute.mockResolvedValue(ok(cat));

      const result = await controller.findOne(1);

      expect(mockFind.execute).toHaveBeenCalledWith(1);
      expect(result).toBe(cat);
    });
  });

  describe('update', () => {
    it('calls updateUseCase.execute with id and dto', async () => {
      const dto = { name: 'Updated' };
      const updated = makeProductCategory({ ...dto });
      mockUpdate.execute.mockResolvedValue(ok(updated));

      const result = await controller.update(1, dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith(1, dto);
      expect(result).toBe(updated);
    });
  });

  describe('remove', () => {
    it('calls deleteUseCase.execute with id', async () => {
      mockDelete.execute.mockResolvedValue(ok(undefined));

      await controller.remove(1);

      expect(mockDelete.execute).toHaveBeenCalledWith(1);
    });
  });
});
