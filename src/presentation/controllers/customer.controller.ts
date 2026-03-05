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
  createCustomerRequestSchema,
  updateCustomerRequestSchema,
  CreateCustomerRequestDto,
  UpdateCustomerRequestDto,
} from '../dtos/customer';
import { CreateCustomerUseCase } from '@application/use-cases/customer/create-customer.use-case';
import { FindCustomerUseCase } from '@application/use-cases/customer/find-customer.use-case';
import { FindAllCustomersUseCase } from '@application/use-cases/customer/find-all-customers.use-case';
import { UpdateCustomerUseCase } from '@application/use-cases/customer/update-customer.use-case';
import { DeleteCustomerUseCase } from '@application/use-cases/customer/delete-customer.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createUseCase: CreateCustomerUseCase,
    private readonly findUseCase: FindCustomerUseCase,
    private readonly findAllUseCase: FindAllCustomersUseCase,
    private readonly updateUseCase: UpdateCustomerUseCase,
    private readonly deleteUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a customer' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['customerDocumentTypeId', 'documentNumber', 'email'],
      properties: {
        customerDocumentTypeId: { type: 'number', example: 1 },
        documentNumber: { type: 'string', example: '1234567890' },
        email: { type: 'string', example: 'john@example.com' },
        contactPhone: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Customer already exists' })
  async create(
    @Body(new ZodValidationPipe(createCustomerRequestSchema))
    dto: CreateCustomerRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, description: 'List of customers' })
  async findAll() {
    return unwrapResult(await this.findAllUseCase.execute());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResult(await this.findUseCase.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contactPhone: { type: 'string', nullable: true },
        address: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateCustomerRequestSchema))
    dto: UpdateCustomerRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiParam({ name: 'id', type: 'number', description: 'Customer ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    unwrapResult(await this.deleteUseCase.execute(id));
  }
}
