export {
  createProductSchema as createProductRequestSchema,
  updateProductSchema as updateProductRequestSchema,
  productSchema as productResponseSchema,
} from '@domain/models/product.entity';

export type {
  CreateProductDto as CreateProductRequestDto,
  UpdateProductDto as UpdateProductRequestDto,
  ProductDto as ProductResponseDto,
} from '@domain/models/product.entity';
