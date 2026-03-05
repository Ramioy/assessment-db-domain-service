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
  create(
    @Body(new ZodValidationPipe(createTransactionRequestSchema))
    dto: CreateTransactionRequestDto,
  ) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll(@Query('customerId') @Optional() customerId?: string) {
    const parsedCustomerId = customerId !== undefined ? parseInt(customerId, 10) : undefined;
    return this.findAllUseCase.execute(parsedCustomerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findUseCase.execute(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateTransactionRequestSchema))
    dto: UpdateTransactionRequestDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }
}
