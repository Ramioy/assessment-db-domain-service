import { CustomerDocumentType } from '@domain/models/customer-document-type.entity';

export interface ICustomerDocumentTypeRepository {
  findById(id: number): Promise<CustomerDocumentType | null>;
  findAll(): Promise<CustomerDocumentType[]>;
  save(entity: CustomerDocumentType): Promise<CustomerDocumentType>;
  delete(id: number): Promise<boolean>;
}
