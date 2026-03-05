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
  create(@Body(new ZodValidationPipe(createCustomerRequestSchema)) dto: CreateCustomerRequestDto) {
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
    @Body(new ZodValidationPipe(updateCustomerRequestSchema)) dto: UpdateCustomerRequestDto,
  ) {
    return this.updateUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteUseCase.execute(id);
  }
}
