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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
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
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Products')
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
  @ApiOperation({ summary: 'Create a product' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'categoryId'],
      properties: {
        name: { type: 'string', example: 'Laptop' },
        description: { type: 'string', nullable: true },
        imageUrl: { type: 'string', nullable: true },
        categoryId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async create(
    @Body(new ZodValidationPipe(createProductRequestSchema))
    dto: CreateProductRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: 'number',
    description: 'Filter by category ID',
  })
  @ApiResponse({ status: 200, description: 'List of products' })
  async findAll(@Query('categoryId') @Optional() categoryId?: string) {
    const parsedCategoryId = categoryId !== undefined ? parseInt(categoryId, 10) : undefined;
    return unwrapResult(await this.findAllUseCase.execute(parsedCategoryId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResult(await this.findUseCase.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string', nullable: true },
        imageUrl: { type: 'string', nullable: true },
        categoryId: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductRequestSchema))
    dto: UpdateProductRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', type: 'number', description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    unwrapResult(await this.deleteUseCase.execute(id));
  }
}
