import {
  Controller,
  Get,
  Post,
  Patch,
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
  createTransactionRequestSchema,
  updateTransactionRequestSchema,
  CreateTransactionRequestDto,
  UpdateTransactionRequestDto,
} from '../dtos/transaction';
import { CreateTransactionUseCase } from '@application/use-cases/transaction/create-transaction.use-case';
import { FindTransactionUseCase } from '@application/use-cases/transaction/find-transaction.use-case';
import { FindAllTransactionsUseCase } from '@application/use-cases/transaction/find-all-transactions.use-case';
import { UpdateTransactionUseCase } from '@application/use-cases/transaction/update-transaction.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createUseCase: CreateTransactionUseCase,
    private readonly findUseCase: FindTransactionUseCase,
    private readonly findAllUseCase: FindAllTransactionsUseCase,
    private readonly updateUseCase: UpdateTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['customerId', 'transactionStatusId'],
      properties: {
        customerId: { type: 'number', example: 1 },
        cut: { type: 'string', nullable: true, example: 'CUT-001' },
        transactionStatusId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid transaction',
  })
  async create(
    @Body(new ZodValidationPipe(createTransactionRequestSchema))
    dto: CreateTransactionRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all transactions' })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: 'number',
    description: 'Filter by customer ID',
  })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async findAll(@Query('customerId') @Optional() customerId?: string) {
    const parsedCustomerId = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    return unwrapResult(await this.findAllUseCase.execute(parsedCustomerId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResult(await this.findUseCase.execute(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transaction status' })
  @ApiParam({ name: 'id', type: 'number', description: 'Transaction ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        customerId: { type: 'number' },
        cut: { type: 'string', nullable: true },
        transactionStatusId: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateTransactionRequestSchema))
    dto: UpdateTransactionRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(id, dto));
  }
}
