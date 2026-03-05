import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { envValidationSchema } from './infrastructure/config/env.validation';
import { databaseConfig } from './infrastructure/config/database.config';
import { ApiKeyGuard } from './shared/guards';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { StockModule } from './modules/stock/stock.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? 'environment/production/.env'
          : 'environment/development/.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    ProductCategoryModule,
    ProductModule,
    StockModule,
    CustomerModule,
    TransactionModule,
    DeliveryModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
