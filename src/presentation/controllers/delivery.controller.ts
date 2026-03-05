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
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { createDeliveryRequestSchema, CreateDeliveryRequestDto } from '../dtos/delivery';
import { CreateDeliveryUseCase } from '@application/use-cases/delivery/create-delivery.use-case';
import { FindDeliveryUseCase } from '@application/use-cases/delivery/find-delivery.use-case';
import { FindAllDeliveriesUseCase } from '@application/use-cases/delivery/find-all-deliveries.use-case';

@Controller('deliveries')
export class DeliveryController {
  constructor(
    private readonly createUseCase: CreateDeliveryUseCase,
    private readonly findUseCase: FindDeliveryUseCase,
    private readonly findAllUseCase: FindAllDeliveriesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(new ZodValidationPipe(createDeliveryRequestSchema)) dto: CreateDeliveryRequestDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query('transactionId') @Optional() transactionId?: string,
    @Query('customerId') @Optional() customerId?: string,
  ) {
    const parsedTransactionId =
      transactionId !== undefined ? parseInt(transactionId, 10) : undefined;
    const parsedCustomerId = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    return this.findAllUseCase.execute(parsedTransactionId, parsedCustomerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findUseCase.execute(id);
  }
}
