import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '@domain/models/stock.entity';
import { DI_TOKENS } from '@infrastructure/config/di-tokens';
import { StockRepository } from '@infrastructure/adapters/database/stock.repository';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { StockController } from '@presentation/controllers/stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [
    FindStockByProductUseCase,
    UpdateStockUseCase,
    {
      provide: DI_TOKENS.STOCK_REPOSITORY,
      useClass: StockRepository,
    },
  ],
  exports: [DI_TOKENS.STOCK_REPOSITORY],
})
export class StockModule {}
