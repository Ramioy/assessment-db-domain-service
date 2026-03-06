import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class Product {
  readonly id: number;
  readonly uuid: string;
  readonly name: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly categoryId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: ProductDto) {
    this.id = props.id;
    this.uuid = props.uuid;
    this.name = props.name;
    this.description = props.description ?? null;
    this.imageUrl = props.imageUrl ?? null;
    this.categoryId = props.categoryId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateProductDto): Product {
    const now = new Date();
    return new Product({
      id: 0,
      uuid: '', // assigned by DB
      name: dto.name,
      description: dto.description ?? null,
      imageUrl: dto.imageUrl ?? null,
      categoryId: dto.categoryId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: ProductDto): Product {
    return new Product(props);
  }

  applyUpdate(dto: UpdateProductDto): Product {
    return new Product({
      id: this.id,
      uuid: this.uuid,
      name: dto.name ?? this.name,
      description: dto.description !== undefined ? dto.description : this.description,
      imageUrl: dto.imageUrl !== undefined ? dto.imageUrl : this.imageUrl,
      categoryId: dto.categoryId ?? this.categoryId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
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
