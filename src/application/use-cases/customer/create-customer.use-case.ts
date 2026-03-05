import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { Customer, CreateCustomerDto } from '@domain/models/customer.entity';
import { NotFoundError, AlreadyExistsError, type DomainError } from '@domain/errors';
import { CustomerRepositoryPort } from '@application/ports/out/customer-repository.port';
import { CustomerDocumentTypeRepositoryPort } from '@application/ports/out/customer-document-type-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(DI_TOKENS.CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepositoryPort,
    @Inject(DI_TOKENS.CUSTOMER_DOCUMENT_TYPE_REPOSITORY)
    private readonly documentTypeRepository: CustomerDocumentTypeRepositoryPort,
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
