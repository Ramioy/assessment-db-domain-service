import { Test, TestingModule } from '@nestjs/testing';
import { StockController } from '@presentation/controllers/stock.controller';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { makeStock } from '../../../helpers/entity-factory';

describe('StockController', () => {
  let controller: StockController;

  const mockFindByProduct = { execute: jest.fn() };
  const mockUpdate = { execute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockController],
      providers: [
        { provide: FindStockByProductUseCase, useValue: mockFindByProduct },
        { provide: UpdateStockUseCase, useValue: mockUpdate },
      ],
    }).compile();

    controller = module.get(StockController);
    jest.clearAllMocks();
  });

  describe('findByProduct', () => {
    it('delegates to findByProductUseCase', async () => {
      const stock = makeStock({ productId: 3 });
      mockFindByProduct.execute.mockResolvedValue(stock);

      const result = await controller.findByProduct(3);

      expect(mockFindByProduct.execute).toHaveBeenCalledWith(3);
      expect(result).toBe(stock);
    });
  });

  describe('update', () => {
    it('delegates to updateUseCase with productId and dto', async () => {
      const dto = { quantity: 100 };
      const updated = makeStock({ productId: 3, quantity: 100 });
      mockUpdate.execute.mockResolvedValue(updated);

      const result = await controller.update(3, dto);

      expect(mockUpdate.execute).toHaveBeenCalledWith(3, dto);
      expect(result).toBe(updated);
    });
  });
});
