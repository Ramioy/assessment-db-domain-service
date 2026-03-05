import { Injectable, Inject } from '@nestjs/common';
import { Stock, UpdateStockDto } from '@domain/models/stock.entity';
import { NotFoundException } from '@domain/exceptions/not-found.exception';
import { IStockRepository } from '@application/ports/out/stock-repository.port';

@Injectable()
export class UpdateStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly repository: IStockRepository,
  ) {}

  async execute(productId: number, dto: UpdateStockDto): Promise<Stock> {
    const entity = await this.repository.findByProductId(productId);
    if (!entity) {
      throw new NotFoundException('Stock for product', productId);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }
}
