import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@domain/models/product-category.entity';
import { InfrastructureError } from '@domain/errors';
import { IProductCategoryRepository } from '@application/ports/out/product-category-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class ProductCategoryRepository implements IProductCategoryRepository {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repo: Repository<ProductCategory>,
  ) {}

  findById(id: number): Promise<Result<ProductCategory | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findAll(): Promise<Result<ProductCategory[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  findByName(name: string): Promise<Result<ProductCategory | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { name } }), wrap);
  }

  save(entity: ProductCategory): Promise<Result<ProductCategory, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
