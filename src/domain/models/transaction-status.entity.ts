import { Entity, Column, OneToMany } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Transaction } from './transaction.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('transaction_statuses')
export class TransactionStatus extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relations
  @OneToMany('Transaction', (tx: Transaction) => tx.status)
  transactions: Transaction[];
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const transactionStatusSchema = baseSchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
});

export const createTransactionStatusSchema = transactionStatusSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTransactionStatusSchema = createTransactionStatusSchema.partial();

export type TransactionStatusDto = z.infer<typeof transactionStatusSchema>;
export type CreateTransactionStatusDto = z.infer<typeof createTransactionStatusSchema>;
export type UpdateTransactionStatusDto = z.infer<typeof updateTransactionStatusSchema>;
