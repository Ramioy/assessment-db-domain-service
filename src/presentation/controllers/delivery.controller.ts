import {
  Controller,
  Get,
  Post,
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
import { createDeliveryRequestSchema, CreateDeliveryRequestDto } from '../dtos/delivery';
import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';
import { unwrapResult } from '../helpers/result-to-http';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveryController {
  constructor(
    private readonly createUseCase: CreateDeliveryUseCase,
    private readonly findUseCase: FindDeliveryUseCase,
    private readonly findAllUseCase: FindAllDeliveriesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a delivery' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['customerId', 'transactionId'],
      properties: {
        customerId: { type: 'number', example: 1 },
        customerAddressId: { type: 'number', nullable: true },
        transactionId: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Delivery created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Customer or Transaction not found' })
  async create(
    @Body(new ZodValidationPipe(createDeliveryRequestSchema))
    dto: CreateDeliveryRequestDto,
  ) {
    return unwrapResult(await this.createUseCase.execute(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all deliveries' })
  @ApiQuery({
    name: 'transactionId',
    required: false,
    type: 'number',
    description: 'Filter by transaction ID',
  })
  @ApiQuery({
    name: 'customerId',
    required: false,
    type: 'number',
    description: 'Filter by customer ID',
  })
  @ApiResponse({ status: 200, description: 'List of deliveries' })
  async findAll(
    @Query('transactionId') @Optional() transactionId?: string,
    @Query('customerId') @Optional() customerId?: string,
  ) {
    const parsedTxId = transactionId !== undefined ? parseInt(transactionId, 10) : undefined;
    const parsedCustId = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    return unwrapResult(await this.findAllUseCase.execute(parsedTxId, parsedCustId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a delivery by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'Delivery ID' })
  @ApiResponse({ status: 200, description: 'Delivery found' })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return unwrapResult(await this.findUseCase.execute(id));
  }
}
