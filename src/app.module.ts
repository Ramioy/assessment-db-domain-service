import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './infrastructure/config/env.validation';

/**
 * App Module - Root NestJS module
 * Wires all layers together (Domain, Application, Infrastructure, Presentation)
 *
 * Hexagonal Architecture Layers:
 * - Domain: Business rules (entities, exceptions, services)
 * - Application: Use cases and orchestration
 * - Infrastructure: Data access, external services, config
 * - Presentation: Controllers and DTOs
 */
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
