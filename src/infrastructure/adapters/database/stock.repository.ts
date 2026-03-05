import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '@domain/models/stock.entity';
import { InfrastructureError } from '@domain/errors';
import { IStockRepository } from '@application/ports/out/stock-repository.port';
import { fromPromise, type Result } from '@shared/result';

const wrap = (e: unknown) => new InfrastructureError('DB_QUERY_FAILED', e);

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,
  ) {}

  findById(id: number): Promise<Result<Stock | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { id } }), wrap);
  }

  findByProductId(productId: number): Promise<Result<Stock | null, InfrastructureError>> {
    return fromPromise(this.repo.findOne({ where: { productId } }), wrap);
  }

  findAll(): Promise<Result<Stock[], InfrastructureError>> {
    return fromPromise(this.repo.find(), wrap);
  }

  save(entity: Stock): Promise<Result<Stock, InfrastructureError>> {
    return fromPromise(this.repo.save(entity), wrap);
  }

  async delete(id: number): Promise<Result<boolean, InfrastructureError>> {
    return fromPromise(
      this.repo.delete(id).then((r) => (r.affected ?? 0) > 0),
      wrap,
    );
  }
}
