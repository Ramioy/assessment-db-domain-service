import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '@domain/models/product-category.entity';
import { ProductCategoryRepositoryPort } from '@application/ports/out/product-category-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { ProductCategoryOrmEntity } from '@infrastructure/persistence/entities/product-category.orm-entity';
import { ProductCategoryMapper } from '@infrastructure/persistence/mappers/product-category.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class ProductCategoryRepository implements ProductCategoryRepositoryPort {
  constructor(
    @InjectRepository(ProductCategoryOrmEntity)
    private readonly repo: Repository<ProductCategoryOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<ProductCategory | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? ProductCategoryMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<ProductCategory[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => ProductCategoryMapper.toDomain(o)));
  }

  async findByName(name: string): Promise<Result<ProductCategory | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { name } }), wrapDbError);
    return map(result, (orm) => (orm ? ProductCategoryMapper.toDomain(orm) : null));
  }

  async save(entity: ProductCategory): Promise<Result<ProductCategory, InfrastructureError>> {
    const orm = ProductCategoryMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => ProductCategoryMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
