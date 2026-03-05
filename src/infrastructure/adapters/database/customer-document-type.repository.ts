import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';
import { ICustomerDocumentTypeRepository } from '@application/ports/out/customer-document-type-repository.port';

@Injectable()
export class CustomerDocumentTypeRepository implements ICustomerDocumentTypeRepository {
  constructor(
    @InjectRepository(CustomerDocumentType)
    private readonly repo: Repository<CustomerDocumentType>,
  ) {}

  findById(id: number): Promise<CustomerDocumentType | null> {
    return this.repo.findOne({ where: { id } });
  }

  findAll(): Promise<CustomerDocumentType[]> {
    return this.repo.find();
  }

  save(entity: CustomerDocumentType): Promise<CustomerDocumentType> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
