import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@domain/models/customer.entity';
import { InfrastructureError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class CustomerRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  findById(id: number): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByEmail(email: string): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { email } }), wrap);
  }

  findByDocumentNumber(
    documentNumber: string,
  ): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { documentNumber } }), wrap);
  }

  findAll(): Promise<Result<Customer[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: Customer): Promise<Result<Customer, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
