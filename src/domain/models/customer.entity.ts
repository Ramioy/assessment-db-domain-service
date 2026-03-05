import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { CustomerDocumentType } from './customer-document-type.entity';
import type { Transaction } from './transaction.entity';
import type { Delivery } from './delivery.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ name: 'customer_document_type_id' })
  customerDocumentTypeId: number;

  @Column({ name: 'document_number', type: 'varchar', length: 50, unique: true })
  documentNumber: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 30, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string | null;

  // Relations
  @ManyToOne('CustomerDocumentType', (dt: CustomerDocumentType) => dt.customers, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_document_type_id' })
  documentType: CustomerDocumentType;

  @OneToMany('Transaction', (tx: Transaction) => tx.customer)
  transactions: Transaction[];

  @OneToMany('Delivery', (d: Delivery) => d.customer)
  deliveries: Delivery[];
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
