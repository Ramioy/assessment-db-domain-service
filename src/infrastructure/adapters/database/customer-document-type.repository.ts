import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { CustomerDocumentTypeRepositoryPort } from '@application/ports/out/customer-document-type-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { CustomerDocumentTypeOrmEntity } from '@infrastructure/persistence/entities/customer-document-type.orm-entity';
import { CustomerDocumentTypeMapper } from '@infrastructure/persistence/mappers/customer-document-type.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class CustomerDocumentTypeRepository implements CustomerDocumentTypeRepositoryPort {
  constructor(
    @InjectRepository(CustomerDocumentTypeOrmEntity)
    private readonly repo: Repository<CustomerDocumentTypeOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<CustomerDocumentType | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? CustomerDocumentTypeMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<CustomerDocumentType[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => CustomerDocumentTypeMapper.toDomain(o)));
  }

  async save(
    entity: CustomerDocumentType,
  ): Promise<Result<CustomerDocumentType, InfrastructureError>> {
    const orm = CustomerDocumentTypeMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => CustomerDocumentTypeMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
