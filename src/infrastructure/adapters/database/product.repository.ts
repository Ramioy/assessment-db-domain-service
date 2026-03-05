import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '@domain/models/product.entity';
import { InfrastructureError } from '@domain/errors';
import { IProductRepository } from '@application/ports/out/product-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findById(id: number): Promise<Result<Product | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByUuid(uuid: string): Promise<Result<Product | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { uuid } }), wrap);
  }

  findAll(): Promise<Result<Product[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  findByCategoryId(categoryId: number): Promise<Result<Product[], InfrastructureError>> {
    return fromPromise(this.repo.find({ where: { categoryId } }), wrap);
  }

  save(entity: Product): Promise<Result<Product, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
