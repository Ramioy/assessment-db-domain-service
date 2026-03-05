import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@domain/models/product.entity';
import { DI_TOKENS } from '@infrastructure/config/di-tokens';
import { ProductRepository } from '@infrastructure/adapters/database/product.repository';
import { CreateProductUseCase } from '@application/use-cases/product/create-product.use-case';
import { FindProductUseCase } from '@application/use-cases/product/find-product.use-case';
import { FindAllProductsUseCase } from '@application/use-cases/product/find-all-products.use-case';
import { UpdateProductUseCase } from '@application/use-cases/product/update-product.use-case';
import { DeleteProductUseCase } from '@application/use-cases/product/delete-product.use-case';
import { ProductController } from '@presentation/controllers/product.controller';
import { ProductCategoryModule } from '../product-category/product-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // CreateProductUseCase validates category existence via IProductCategoryRepository
    ProductCategoryModule,
  ],
  controllers: [ProductController],
  providers: [
    CreateProductUseCase,
    FindProductUseCase,
    FindAllProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    {
      provide: DI_TOKENS.PRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [DI_TOKENS.PRODUCT_REPOSITORY],
})
export class ProductModule {}
