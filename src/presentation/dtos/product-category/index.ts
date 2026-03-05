export {
  createProductCategorySchema as createProductCategoryRequestSchema,
  updateProductCategorySchema as updateProductCategoryRequestSchema,
  productCategorySchema as productCategoryResponseSchema,
} from '@domain/models/product-category.entity';

export type {
  CreateProductCategoryDto as CreateProductCategoryRequestDto,
  UpdateProductCategoryDto as UpdateProductCategoryRequestDto,
  ProductCategoryDto as ProductCategoryResponseDto,
} from '@domain/models/product-category.entity';
