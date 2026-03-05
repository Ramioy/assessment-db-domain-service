import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  createProductCategoryRequestSchema,
  updateProductCategoryRequestSchema,
  CreateProductCategoryRequestDto,
  UpdateProductCategoryRequestDto,
} from '../dtos/product-category';
import { CreateProductCategoryUseCase } from '@application/use-cases/product-category/create-product-category.use-case';
import { FindProductCategoryUseCase } from '@application/use-cases/product-category/find-product-category.use-case';
import { FindAllProductCategoriesUseCase } from '@application/use-cases/product-category/find-all-product-categories.use-case';
import { UpdateProductCategoryUseCase } from '@application/use-cases/product-category/update-product-category.use-case';
import { DeleteProductCategoryUseCase } from '@application/use-cases/product-category/delete-product-category.use-case';

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly createUseCase: CreateProductCategoryUseCase,
    private readonly findUseCase: FindProductCategoryUseCase,
    private readonly findAllUseCase: FindAllProductCategoriesUseCase,
    private readonly updateUseCase: UpdateProductCategoryUseCase,
    private readonly deleteUseCase: DeleteProductCategoryUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe(createProductCategoryRequestSchema))
    dto: CreateProductCategoryRequestDto,
  ) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll() {
    return this.findAllUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductCategoryRequestSchema))
    dto: UpdateProductCategoryRequestDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
