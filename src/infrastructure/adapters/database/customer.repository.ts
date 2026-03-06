import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '@domain/models/customer.entity';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { CustomerOrmEntity } from '@infrastructure/persistence/entities/customer.orm-entity';
import { CustomerMapper } from '@infrastructure/persistence/mappers/customer.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repo: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<Customer | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? CustomerMapper.toDomain(orm) : null));
  }

  async findByEmail(email: string): Promise<Result<Customer | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { email } }), wrapDbError);
    return map(result, (orm) => (orm ? CustomerMapper.toDomain(orm) : null));
  }

  async findByDocumentNumber(
    documentNumber: string,
  ): Promise<Result<Customer | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { documentNumber } }), wrapDbError);
    return map(result, (orm) => (orm ? CustomerMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<Customer[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => CustomerMapper.toDomain(o)));
  }

  async save(entity: Customer): Promise<Result<Customer, InfrastructureError>> {
    const orm = CustomerMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => CustomerMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
