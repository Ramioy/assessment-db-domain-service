import { Injectable, Inject } from '@nestjs/common';
import { Stock } from '@domain/models/stock.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IStockRepository } from '@application/ports/out/stock-repository.port';

@Injectable()
export class FindStockByProductUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly repository: IStockRepository,
  ) {}

  async execute(productId: number): Promise<Stock> {
    const entity = await this.repository.findByProductId(productId);
    if (!entity) {
      throw new NotFoundException('Stock for product', productId);
    }
    return entity;
  }
}
