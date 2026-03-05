import { Injectable, Inject } from '@nestjs/common';
import { Stock, UpdateStockDto } from '@domain/models/stock.entity';
import { NotFoundError, type DomainError } from '@domain/errors';
import { IStockRepository } from '@application/ports/out/stock-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdateStockUseCase {
  constructor(
    @Inject('IStockRepository')
    private readonly repository: IStockRepository,
  ) {}

  async execute(productId: number, dto: UpdateStockDto): Promise<Result<Stock, DomainError>> {
    const findResult = await this.repository.findByProductId(productId);
    if (!findResult.ok) return findResult;
    if (!findResult.value) return err(new NotFoundError('Stock for product', productId));

    Object.assign(findResult.value, dto);
    return this.repository.save(findResult.value);
  }
}
