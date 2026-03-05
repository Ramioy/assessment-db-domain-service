import { Injectable, Inject } from '@nestjs/common';
import { Customer, CreateCustomerDto } from '@domain/models/customer.entity';
import { AlreadyExistsException } from '@domain/exceptions/already-exists.exception';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { ICustomerRepository } from '@application/ports/out/customer-repository.port';
import { ICustomerDocumentTypeRepository } from '@application/ports/out/customer-document-type-repository.port';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('ICustomerDocumentTypeRepository')
    private readonly documentTypeRepository: ICustomerDocumentTypeRepository,
  ) {}

  async execute(dto: CreateCustomerDto): Promise<Customer> {
    const docType = await this.documentTypeRepository.findById(dto.customerDocumentTypeId);
    if (!docType) {
      throw new NotFoundException('CustomerDocumentType', dto.customerDocumentTypeId);
    }
    const existingByEmail = await this.customerRepository.findByEmail(dto.email);
    if (existingByEmail) {
      throw new AlreadyExistsException('Customer', 'email', dto.email);
    }
    const existingByDoc = await this.customerRepository.findByDocumentNumber(dto.documentNumber);
    if (existingByDoc) {
      throw new AlreadyExistsException('Customer', 'documentNumber', dto.documentNumber);
    }
    const entity = Object.assign(new Customer(), dto);
    return this.customerRepository.save(entity);
  }
}
