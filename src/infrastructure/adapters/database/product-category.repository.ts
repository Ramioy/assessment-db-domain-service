import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@domain/models/product-category.entity';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';

@Injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repo: Repository<ProductCategory>,
  ) {}

  findById(id: number): Promise<ProductCategory | null> {
    return this.repo.findOne({ where: { id } });
  }

  findAll(): Promise<ProductCategory[]> {
    return this.repo.find();
  }

  findByName(name: string): Promise<ProductCategory | null> {
    return this.repo.findOne({ where: { name } });
  }

  save(entity: ProductCategory): Promise<ProductCategory> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
