import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/models/product.entity';
import { IProductRepository } from '@application/ports/out/product-repository.port';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findById(id: number): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByUuid(uuid: string): Promise<Product | null> {
    return this.repo.findOne({ where: { uuid } });
  }

  findAll(): Promise<Product[]> {
    return this.repo.find();
  }

  findByCategoryId(categoryId: number): Promise<Product[]> {
    return this.repo.find({ where: { categoryId } });
  }

  save(entity: Product): Promise<Product> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
