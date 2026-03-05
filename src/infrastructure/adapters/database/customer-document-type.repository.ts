import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { CustomerDocumentTypeRepositoryPort } from '@application/ports/out/customer-document-type-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@domain/errors';

@Injectable()
export class CustomerDocumentTypeRepository implements CustomerDocumentTypeRepositoryPort {
  constructor(
    @InjectRepository(CustomerDocumentType)
    private readonly repo: Repository<CustomerDocumentType>,
  ) {}

  findById(id: number): Promise<Result<CustomerDocumentType | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findAll(): Promise<Result<CustomerDocumentType[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: CustomerDocumentType): Promise<Result<CustomerDocumentType, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
