import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '@domain/models/stock.entity';
import { StockRepositoryPort } from '@application/ports/out/stock-repository.port';
import { fromPromise, map, type Result } from '@shared/result';
import { StockOrmEntity } from '@infrastructure/persistence/entities/stock.orm-entity';
import { StockMapper } from '@infrastructure/persistence/mappers/stock.mapper';
import { wrapDbError } from './base.repository';
import type { InfrastructureError } from '@shared/errors';

@Injectable()
export class StockRepository implements StockRepositoryPort {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly repo: Repository<StockOrmEntity>,
  ) {}

  async findById(id: number): Promise<Result<Stock | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { id } }), wrapDbError);
    return map(result, (orm) => (orm ? StockMapper.toDomain(orm) : null));
  }

  async findByProductId(productId: number): Promise<Result<Stock | null, InfrastructureError>> {
    const result = await fromPromise(this.repo.findOne({ where: { productId } }), wrapDbError);
    return map(result, (orm) => (orm ? StockMapper.toDomain(orm) : null));
  }

  async findAll(): Promise<Result<Stock[], InfrastructureError>> {
    const result = await fromPromise(this.repo.find(), wrapDbError);
    return map(result, (orms) => orms.map((o) => StockMapper.toDomain(o)));
  }

  async save(entity: Stock): Promise<Result<Stock, InfrastructureError>> {
    const orm = StockMapper.toOrm(entity);
    const result = await fromPromise(this.repo.save(orm), wrapDbError);
    return map(result, (o) => StockMapper.toDomain(o));
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrapDbError,
    );
  }
}
