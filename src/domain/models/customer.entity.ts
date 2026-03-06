import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class Customer {
  readonly id: number;
  readonly customerDocumentTypeId: number;
  readonly documentNumber: string;
  readonly email: string;
  readonly contactPhone: string | null;
  readonly address: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CustomerDto) {
    this.id = props.id;
    this.customerDocumentTypeId = props.customerDocumentTypeId;
    this.documentNumber = props.documentNumber;
    this.email = props.email;
    this.contactPhone = props.contactPhone ?? null;
    this.address = props.address ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateCustomerDto): Customer {
    const now = new Date();
    return new Customer({
      id: 0,
      customerDocumentTypeId: dto.customerDocumentTypeId,
      documentNumber: dto.documentNumber,
      email: dto.email,
      contactPhone: dto.contactPhone ?? null,
      address: dto.address ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: CustomerDto): Customer {
    return new Customer(props);
  }

  applyUpdate(dto: UpdateCustomerDto): Customer {
    return new Customer({
      id: this.id,
      customerDocumentTypeId: dto.customerDocumentTypeId ?? this.customerDocumentTypeId,
      documentNumber: dto.documentNumber ?? this.documentNumber,
      email: dto.email ?? this.email,
      contactPhone: dto.contactPhone !== undefined ? dto.contactPhone : this.contactPhone,
      address: dto.address !== undefined ? dto.address : this.address,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const customerSchema = baseSchema.extend({
  customerDocumentTypeId: z.number().int().positive(),
  documentNumber: z.string().min(1).max(50),
  email: z.string().email().max(255),
  contactPhone: z.string().max(30).nullable().optional(),
  address: z.string().nullable().optional(),
});

export const createCustomerSchema = customerSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCustomerSchema = createCustomerSchema.partial();

export type CustomerDto = z.infer<typeof customerSchema>;
export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;
