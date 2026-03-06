import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class CustomerDocumentType {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: CustomerDocumentTypeDto) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateCustomerDocumentTypeDto): CustomerDocumentType {
    const now = new Date();
    return new CustomerDocumentType({
      id: 0,
      name: dto.name,
      description: dto.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: CustomerDocumentTypeDto): CustomerDocumentType {
    return new CustomerDocumentType(props);
  }

  applyUpdate(dto: UpdateCustomerDocumentTypeDto): CustomerDocumentType {
    return new CustomerDocumentType({
      id: this.id,
      name: dto.name ?? this.name,
      description: dto.description !== undefined ? dto.description : this.description,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const customerDocumentTypeSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
});

export const createCustomerDocumentTypeSchema = customerDocumentTypeSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateCustomerDocumentTypeSchema = createCustomerDocumentTypeSchema.partial();

export type CustomerDocumentTypeDto = z.infer<typeof customerDocumentTypeSchema>;
export type CreateCustomerDocumentTypeDto = z.infer<typeof createCustomerDocumentTypeSchema>;
export type UpdateCustomerDocumentTypeDto = z.infer<typeof updateCustomerDocumentTypeSchema>;
