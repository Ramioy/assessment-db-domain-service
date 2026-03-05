import { Entity, Column, ManyToOne, JoinColumn, Generated } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Customer } from './customer.entity';
import type { Transaction } from './transaction.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('deliveries')
export class Delivery extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  /**
   * customer_address_id — references a customer address record.
   * If a separate CustomerAddress entity exists, add the relation here.
   */
  @Column({ name: 'customer_address_id', nullable: true })
  customerAddressId: number | null;

  @Column({ name: 'transaction_id' })
  transactionId: number;

  // Relations
  @ManyToOne('Customer', (c: Customer) => c.deliveries, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne('Transaction', (tx: Transaction) => tx.deliveries, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const deliverySchema = baseSchema.extend({
  uuid: z.string().uuid(),
  customerId: z.number().int().positive(),
  customerAddressId: z.number().int().positive().nullable().optional(),
  transactionId: z.number().int().positive(),
});

export const createDeliverySchema = deliverySchema.omit({
  id: true,
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDeliverySchema = createDeliverySchema.partial();

export type DeliveryDto = z.infer<typeof deliverySchema>;
export type CreateDeliveryDto = z.infer<typeof createDeliverySchema>;
export type UpdateDeliveryDto = z.infer<typeof updateDeliverySchema>;
