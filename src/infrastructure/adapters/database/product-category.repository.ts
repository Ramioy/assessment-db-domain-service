import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@domain/models/product-category.entity';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class ProductCategoryRepository implements ProductCategoryRepositoryPort {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly repo: Repository<ProductCategory>,
  ) {}

  findById(id: number): Promise<Result<ProductCategory | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findAll(): Promise<Result<ProductCategory[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  findByName(name: string): Promise<Result<ProductCategory | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { name } }), wrapDbError);
  }

  save(entity: ProductCategory): Promise<Result<ProductCategory, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
