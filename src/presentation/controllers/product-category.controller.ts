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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
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
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Product Categories')
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
  @ApiOperation({ summary: 'Create a product category' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', example: 'Electronics' },
        description: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async create(
    @Body(new ZodValidationPipe(createProductCategoryRequestSchema))
    dto: CreateProductCategoryRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async findAll() {
    return unwrapResult(await this.findAllUseCase.execute());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product category by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResult(await this.findUseCase.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product category' })
  @ApiParam({ name: 'id', type: 'number', description: 'Category ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductCategoryRequestSchema))
    dto: UpdateProductCategoryRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product category' })
  @ApiParam({ name: 'id', type: 'number', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    unwrapResult(await this.deleteUseCase.execute(id));
  }
}
