import {
  ProductCategory,
  CreateProductCategoryDto,
  UpdateProductCategoryDto,
} from '@domain/models/product-category.entity';

export interface IProductCategoryInputPort {
  create(dto: CreateProductCategoryDto): Promise<ProductCategory>;
  findById(id: number): Promise<ProductCategory>;
  findAll(): Promise<ProductCategory[]>;
  update(id: number, dto: UpdateProductCategoryDto): Promise<ProductCategory>;
  delete(id: number): Promise<void>;
}
