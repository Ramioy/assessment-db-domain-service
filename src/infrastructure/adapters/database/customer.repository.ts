import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@domain/models/customer.entity';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  findById(id: number): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByEmail(email: string): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { email } }), wrapDbError);
  }

  findByDocumentNumber(
    documentNumber: string,
  ): Promise<Result<Customer | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { documentNumber } }), wrapDbError);
  }

  findAll(): Promise<Result<Customer[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: Customer): Promise<Result<Customer, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
