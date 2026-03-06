import { Controller, Get, Post, Patch, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import {
  createPaymentTransactionRequestSchema,
  updatePaymentTransactionRequestSchema,
  type CreatePaymentTransactionRequestDto,
  type UpdatePaymentTransactionRequestDto,
} from '../dtos/payment-transaction';
import { CreatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/create-payment-transaction.use-case';
import { FindPaymentTransactionUseCase } from '@application/use-cases/payment-transaction/find-payment-transaction.use-case';
import { FindAllPaymentTransactionsUseCase } from '@application/use-cases/payment-transaction/find-all-payment-transactions.use-case';
import { UpdatePaymentTransactionUseCase } from '@application/use-cases/payment-transaction/update-payment-transaction.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Payment Transactions')
@Controller('payment-transactions')
export class PaymentTransactionController {
  constructor(
    private readonly createUseCase: CreatePaymentTransactionUseCase,
    private readonly findUseCase: FindPaymentTransactionUseCase,
    private readonly findAllUseCase: FindAllPaymentTransactionsUseCase,
    private readonly updateUseCase: UpdatePaymentTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a payment transaction' })
  @ApiResponse({ status: 201, description: 'Payment transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Payment transaction with reference already exists' })
  async create(
    @Body(new ZodValidationPipe(createPaymentTransactionRequestSchema))
    dto: CreatePaymentTransactionRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all payment transactions' })
  @ApiResponse({ status: 200, description: 'List of payment transactions' })
  async findAll() {
    return unwrapResult(await this.findAllUseCase.execute());
  }

  // NOTE: Custom routes must be declared BEFORE ':id' to avoid NestJS treating
  // 'by-reference' as a UUID :id parameter.
  @Get('by-reference/:reference')
  @ApiOperation({ summary: 'Get a payment transaction by reference' })
  @ApiParam({ name: 'reference', type: 'string', description: 'Unique payment reference' })
  @ApiResponse({ status: 200, description: 'Payment transaction found' })
  @ApiResponse({ status: 404, description: 'Payment transaction not found' })
  async findByReference(@Param('reference') reference: string) {
    return unwrapResult(await this.findUseCase.executeByReference(reference));
  }

  @Get('by-provider-id/:providerId')
  @ApiOperation({ summary: 'Get a payment transaction by provider ID' })
  @ApiParam({ name: 'providerId', type: 'string', description: 'Provider-assigned transaction ID' })
  @ApiResponse({ status: 200, description: 'Payment transaction found' })
  @ApiResponse({ status: 404, description: 'Payment transaction not found' })
  async findByProviderId(@Param('providerId') providerId: string) {
    return unwrapResult(await this.findUseCase.executeByProviderId(providerId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a payment transaction by ID' })
  @ApiParam({ name: 'id', type: 'string', description: 'Payment transaction UUID' })
  @ApiResponse({ status: 200, description: 'Payment transaction found' })
  @ApiResponse({ status: 404, description: 'Payment transaction not found' })
  async findOne(@Param('id') id: string) {
    return unwrapResult(await this.findUseCase.execute(id));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update payment transaction status' })
  @ApiParam({ name: 'id', type: 'string', description: 'Payment transaction UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        providerId: { type: 'string', nullable: true },
        status: { type: 'string', example: 'APPROVED' },
        statusMessage: { type: 'string', nullable: true },
        providerResponse: { type: 'object', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Payment transaction status updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment transaction not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePaymentTransactionRequestSchema))
    dto: UpdatePaymentTransactionRequestDto,
  ) {
    return unwrapResult(await this.updateUseCase.execute(id, dto));
  }
}
