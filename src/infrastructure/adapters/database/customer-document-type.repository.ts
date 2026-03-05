import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { InfrastructureError } from '@domain/errors';
import { ICustomerDocumentTypeRepository } from '@application/ports/out/customer-document-type-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class CustomerDocumentTypeRepository implements ICustomerDocumentTypeRepository {
  constructor(
    @InjectRepository(CustomerDocumentType)
    private readonly repo: Repository<CustomerDocumentType>,
  ) {}

  findById(id: number): Promise<Result<CustomerDocumentType | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findAll(): Promise<Result<CustomerDocumentType[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: CustomerDocumentType): Promise<Result<CustomerDocumentType, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
