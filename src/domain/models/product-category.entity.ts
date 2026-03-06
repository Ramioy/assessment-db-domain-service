import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class ProductCategory {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: ProductCategoryDto) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateProductCategoryDto): ProductCategory {
    const now = new Date();
    return new ProductCategory({
      id: 0,
      name: dto.name,
      description: dto.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: ProductCategoryDto): ProductCategory {
    return new ProductCategory(props);
  }

  applyUpdate(dto: UpdateProductCategoryDto): ProductCategory {
    return new ProductCategory({
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
