import {
  Product,
  CreateProductDto,
  UpdateProductDto,
} from '@domain/models/product.entity';

export interface IProductInputPort {
  create(dto: CreateProductDto): Promise<Product>;
  findById(id: number): Promise<Product>;
  findAll(categoryId?: number): Promise<Product[]>;
  update(id: number, dto: UpdateProductDto): Promise<Product>;
  delete(id: number): Promise<void>;
}
