import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/models/product.entity';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { ProductOrmEntity } from '@infrastructure/persistence/entities/product.orm-entity';
import { ProductMapper } from '@infrastructure/persistence/mappers/product.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repo: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<Product | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? ProductMapper.toDomain(orm) : null));
  }

  async findByUuid(uuid: string): Promise<Result<Product | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { uuid } }), wrapDbError);
    return map(result, (orm) => (orm ? ProductMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<Product[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => ProductMapper.toDomain(o)));
  }

  async findByCategoryId(categoryId: number): Promise<Result<Product[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find({ where: { categoryId } }), wrapDbError);
    return map(result, (orms) => orms.map((o) => ProductMapper.toDomain(o)));
  }

  async save(entity: Product): Promise<Result<Product, InfrastructureError>> {
    const orm = ProductMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => ProductMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
