import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Optional,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  createProductRequestSchema,
  updateProductRequestSchema,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from '../dtos/product';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { FindAllProductsUseCase } from '@application/use-cases/product/find-all-products.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createUseCase: CreateProductUseCase,
    private readonly findUseCase: FindProductUseCase,
    private readonly findAllUseCase: FindAllProductsUseCase,
    private readonly updateUseCase: UpdateProductUseCase,
    private readonly deleteUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new ZodValidationPipe(createProductRequestSchema)) dto: CreateProductRequestDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll(@Query('categoryId') @Optional() categoryId?: string) {
    const parsedCategoryId = categoryId !== undefined ? parseInt(categoryId, 10) : undefined;
    return this.findAllUseCase.execute(parsedCategoryId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductRequestSchema)) dto: UpdateProductRequestDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
