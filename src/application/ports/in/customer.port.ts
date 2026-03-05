import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@domain/models/customer.entity';

export interface ICustomerInputPort {
  create(dto: CreateCustomerDto): Promise<Customer>;
  findById(id: number): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  update(id: number, dto: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
}
