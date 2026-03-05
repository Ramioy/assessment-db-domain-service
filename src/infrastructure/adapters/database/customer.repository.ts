import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@domain/models/customer.entity';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  findById(id: number): Promise<Customer | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { email } });
  }

  findByDocumentNumber(documentNumber: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { documentNumber } });
  }

  findAll(): Promise<Customer[]> {
    return this.repo.find();
  }

  save(entity: Customer): Promise<Customer> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
