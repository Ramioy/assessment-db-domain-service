import { Injectable, Inject } from '@nestjs/common';
import { Customer, CreateCustomerDto } from '@domain/models/customer.entity';
import { NotFoundError, AlreadyExistsError, type DomainError } from '@domain/errors';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ICustomerDocumentTypeRepository } from '@application/ports/out/customer-document-type-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('ICustomerDocumentTypeRepository')
    private readonly documentTypeRepository: ICustomerDocumentTypeRepository,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<Result<Customer, DomainError>> {
    const docTypeResult = await this.documentTypeRepository.findById(dto.customerDocumentTypeId);
    if (!docTypeResult.ok) return docTypeResult;
    if (!docTypeResult.value) {
      return err(new NotFoundError('CustomerDocumentType', dto.customerDocumentTypeId));
    }

    const emailResult = await this.customerRepository.findByEmail(dto.email);
    if (!emailResult.ok) return emailResult;
    if (emailResult.value) {
      return err(new AlreadyExistsError('Customer', 'email', dto.email));
    }

    const docResult = await this.customerRepository.findByDocumentNumber(dto.documentNumber);
    if (!docResult.ok) return docResult;
    if (docResult.value) {
      return err(new AlreadyExistsError('Customer', 'documentNumber', dto.documentNumber));
    }

    const entity = Object.assign(new Customer(), dto);
    return this.customerRepository.save(entity);
  }
}
