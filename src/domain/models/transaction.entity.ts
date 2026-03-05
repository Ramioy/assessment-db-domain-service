import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Customer } from './customer.entity';
import type { TransactionStatus } from './transaction-status.entity';
import type { Delivery } from './delivery.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ name: 'customer_id' })
  customerId: number;

  /**
   * "cut" — kept as-is from diagram.
   * Likely represents a billing cut / instalment reference.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  cut: string | null;

  @Column({ name: 'transaction_status_id' })
  transactionStatusId: number;

  // Relations
  @ManyToOne('Customer', (c: Customer) => c.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne('TransactionStatus', (ts: TransactionStatus) => ts.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'transaction_status_id' })
  status: TransactionStatus;

  @OneToMany('Delivery', (d: Delivery) => d.transaction)
  deliveries: Delivery[];
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const transactionSchema = baseSchema.extend({
  customerId: z.number().int().positive(),
  cut: z.string().max(255).nullable().optional(),
  transactionStatusId: z.number().int().positive(),
});

export const createTransactionSchema = transactionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type TransactionDto       = z.infer<typeof transactionSchema>;
export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
