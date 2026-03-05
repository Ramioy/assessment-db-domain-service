import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/models/product.entity';
import { ProductRepositoryPort } from '@application/ports/out/product-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class ProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findById(id: number): Promise<Result<Product | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByUuid(uuid: string): Promise<Result<Product | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { uuid } }), wrapDbError);
  }

  findAll(): Promise<Result<Product[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  findByCategoryId(categoryId: number): Promise<Result<Product[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { categoryId } }), wrapDbError);
  }

  save(entity: Product): Promise<Result<Product, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
