import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { updateStockRequestSchema, UpdateStockRequestDto } from '../dtos/stock';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';

@Controller('products/:productId/stock')
export class StockController {
  constructor(
    private readonly findByProductUseCase: FindStockByProductUseCase,
    private readonly updateUseCase: UpdateStockUseCase,
  ) {}

  @Get()
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.findByProductUseCase.execute(productId);
  }

  @Patch()
  update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ZodValidationPipe(updateStockRequestSchema)) dto: UpdateStockRequestDto,
  ) {
    return this.updateUseCase.execute(productId, dto);
  }
}
