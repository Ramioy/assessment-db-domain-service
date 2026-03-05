import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '@domain/models/stock.entity';
import { IStockRepository } from '@application/ports/out/stock-repository.port';

@Injectable()
export class StockRepository implements IStockRepository {
  constructor(
    @InjectRepository(Stock)
    private readonly repo: Repository<Stock>,
  ) {}

  findById(id: number): Promise<Stock | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByProductId(productId: number): Promise<Stock | null> {
    return this.repo.findOne({ where: { productId } });
  }

  findAll(): Promise<Stock[]> {
    return this.repo.find();
  }

  save(entity: Stock): Promise<Stock> {
    return this.repo.save(entity);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
