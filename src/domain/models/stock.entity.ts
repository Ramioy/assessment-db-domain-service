import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Product } from './product.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('stocks')
export class Stock extends BaseEntity {
  @Column({ name: 'product_id' })
  productId: number;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  // Relations
  @OneToOne('Product', (product: Product) => product.stock, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
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

export type StockDto       = z.infer<typeof stockSchema>;
export type CreateStockDto = z.infer<typeof createStockSchema>;
export type UpdateStockDto = z.infer<typeof updateStockSchema>;
