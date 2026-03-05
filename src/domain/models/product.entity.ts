import { Entity, Column, ManyToOne, OneToOne, JoinColumn, Generated } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { ProductCategory } from './product-category.entity';
import type { Stock } from './stock.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 2048, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'category_id' })
  categoryId: number;

  // Relations
  @ManyToOne('ProductCategory', (cat: ProductCategory) => cat.products, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @OneToOne('Stock', (stock: Stock) => stock.product)
  stock: Stock;
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const productSchema = baseSchema.extend({
  uuid: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().max(2048).nullable().optional(),
  categoryId: z.number().int().positive(),
});

export const createProductSchema = productSchema.omit({
  id: true,
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductSchema = createProductSchema.partial();

export type ProductDto = z.infer<typeof productSchema>;
export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
