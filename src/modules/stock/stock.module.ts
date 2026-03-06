import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockOrmEntity } from '@infrastructure/persistence/entities/stock.orm-entity';
import { DI_TOKENS } from '@shared/di-tokens';
import { StockRepository } from '@infrastructure/adapters/database/stock.repository';
import { FindStockByProductUseCase } from '@application/use-cases/stock/find-stock-by-product.use-case';
import { UpdateStockUseCase } from '@application/use-cases/stock/update-stock.use-case';
import { StockController } from '@presentation/controllers/stock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockOrmEntity])],
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
