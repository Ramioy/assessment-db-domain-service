import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class TransactionStatus {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: TransactionStatusDto) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateTransactionStatusDto): TransactionStatus {
    const now = new Date();
    return new TransactionStatus({
      id: 0,
      name: dto.name,
      description: dto.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: TransactionStatusDto): TransactionStatus {
    return new TransactionStatus(props);
  }

  applyUpdate(dto: UpdateTransactionStatusDto): TransactionStatus {
    return new TransactionStatus({
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
