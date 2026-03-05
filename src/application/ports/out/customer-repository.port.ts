import { Customer } from '@domain/models/customer.entity';

export interface ICustomerRepository {
  findById(id: number): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByDocumentNumber(documentNumber: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  save(entity: Customer): Promise<Customer>;
  delete(id: number): Promise<boolean>;
}
