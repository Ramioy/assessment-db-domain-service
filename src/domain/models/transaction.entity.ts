import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class Transaction {
  readonly id: number;
  readonly customerId: number;
  /**
   * "cut" — kept as-is from diagram.
   * Likely represents a billing cut / instalment reference.
   */
  readonly cut: string | null;
  readonly transactionStatusId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: TransactionDto) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.cut = props.cut ?? null;
    this.transactionStatusId = props.transactionStatusId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateTransactionDto): Transaction {
    const now = new Date();
    return new Transaction({
      id: 0,
      customerId: dto.customerId,
      cut: dto.cut ?? null,
      transactionStatusId: dto.transactionStatusId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: TransactionDto): Transaction {
    return new Transaction(props);
  }

  applyUpdate(dto: UpdateTransactionDto): Transaction {
    return new Transaction({
      id: this.id,
      customerId: dto.customerId ?? this.customerId,
      cut: dto.cut !== undefined ? dto.cut : this.cut,
      transactionStatusId: dto.transactionStatusId ?? this.transactionStatusId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
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

export type TransactionDto = z.infer<typeof transactionSchema>;
export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
