import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '@domain/models/stock.entity';
import { StockRepositoryPort } from '@application/ports/out/stock-repository.port';
import { fromPromise, type Result } from '@shared/result';

import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@domain/errors';

@Injectable()
export class StockRepository implements StockRepositoryPort {
  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,
  ) {}

  findById(id: number): Promise<Result<Stock | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
  }

  findByProductId(productId: number): Promise<Result<Stock | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { productId } }), wrapDbError);
  }

  findAll(): Promise<Result<Stock[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrapDbError);
  }

  save(entity: Stock): Promise<Result<Stock, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrapDbError);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
