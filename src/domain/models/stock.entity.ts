import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
import { ok, err, type Result } from '@shared/result';
import { InsufficientStockError } from '@domain/errors';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class Stock {
  readonly id: number;
  readonly productId: number;
  readonly description: string | null;
  readonly quantity: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: StockDto) {
    this.id = props.id;
    this.productId = props.productId;
    this.description = props.description ?? null;
    this.quantity = props.quantity;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateStockDto): Stock {
    const now = new Date();
    return new Stock({
      id: 0,
      productId: dto.productId,
      description: dto.description ?? null,
      quantity: dto.quantity ?? 0,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: StockDto): Stock {
    return new Stock(props);
  }

  applyUpdate(dto: UpdateStockDto): Stock {
    return new Stock({
      id: this.id,
      productId: this.productId,
      description: dto.description !== undefined ? dto.description : this.description,
      quantity: dto.quantity ?? this.quantity,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  hasEnough(qty: number): boolean {
    return qty > 0 && this.quantity >= qty;
  }

  decrement(qty: number): Result<Stock, InsufficientStockError> {
    if (qty <= 0 || this.quantity < qty) {
      return err(new InsufficientStockError(this.productId, qty, this.quantity));
    }
    return ok(
      new Stock({
        id: this.id,
        productId: this.productId,
        description: this.description,
        quantity: this.quantity - qty,
        createdAt: this.createdAt,
        updatedAt: new Date(),
      }),
    );
  }
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const stockSchema = baseSchema.extend({
  productId: z.number().int().positive(),
  description: z.string().nullable().optional(),
  quantity: z.number().int().min(0),
});

export const createStockSchema = stockSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateStockSchema = createStockSchema.partial();

export type StockDto = z.infer<typeof stockSchema>;
export type CreateStockDto = z.infer<typeof createStockSchema>;
export type UpdateStockDto = z.infer<typeof updateStockSchema>;
