import { Controller, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { updateStockRequestSchema, UpdateStockRequestDto } from '../dtos/stock';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Stock')
@Controller('products/:productId/stock')
export class StockController {
  constructor(
    private readonly findByProductUseCase: FindStockByProductUseCase,
    private readonly updateUseCase: UpdateStockUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get stock by product ID' })
  @ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Stock found' })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return unwrapResult(await this.findByProductUseCase.execute(productId));
  }

  @Patch()
  @ApiOperation({ summary: 'Update stock for a product' })
  @ApiParam({ name: 'productId', type: 'number', description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string', nullable: true },
        quantity: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async update(
    @Param('productId', ParseIntPipe) productId: number,
    @Body(new ZodValidationPipe(updateStockRequestSchema))
    dto: UpdateStockRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(productId, dto));
  }
}
