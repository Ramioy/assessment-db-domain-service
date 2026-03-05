import { Entity, Column, OneToMany } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Customer } from './customer.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('customer_document_types')
export class CustomerDocumentType extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relations
  @OneToMany('Customer', (customer: Customer) => customer.documentType)
  customers: Customer[];
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

export const updateCustomerDocumentTypeSchema =
  createCustomerDocumentTypeSchema.partial();

export type CustomerDocumentTypeDto       = z.infer<typeof customerDocumentTypeSchema>;
export type CreateCustomerDocumentTypeDto = z.infer<typeof createCustomerDocumentTypeSchema>;
export type UpdateCustomerDocumentTypeDto = z.infer<typeof updateCustomerDocumentTypeSchema>;
