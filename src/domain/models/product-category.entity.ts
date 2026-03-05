import { Entity, Column, OneToMany } from 'typeorm';
import { z } from 'zod';
import { BaseEntity, baseSchema } from './base.entity';
import type { Product } from './product.entity';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
@Entity('product_categories')
export class ProductCategory extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  // Relations
  @OneToMany('Product', (product: Product) => product.category)
  products: Product[];
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const productCategorySchema = baseSchema.extend({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
});

export const createProductCategorySchema = productCategorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProductCategorySchema = createProductCategorySchema.partial();

export type ProductCategoryDto = z.infer<typeof productCategorySchema>;
export type CreateProductCategoryDto = z.infer<typeof createProductCategorySchema>;
export type UpdateProductCategoryDto = z.infer<typeof updateProductCategorySchema>;
