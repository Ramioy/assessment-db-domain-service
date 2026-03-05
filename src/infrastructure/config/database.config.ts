import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ALL_ENTITIES } from '@domain/models';

/**
 * TypeORM configuration factory.
 * Consumed by TypeOrmModule.forRootAsync in AppModule.
 */
export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: config.get<number>('DB_PORT', 5432),
  username: config.get<string>('DB_USERNAME'),
  password: config.get<string>('DB_PASSWORD'),
  database: config.get<string>('DB_DATABASE'),
  entities: [...ALL_ENTITIES],
  synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
  logging: config.get<boolean>('DB_LOGGING', false),
  ssl: config.get<boolean>('DB_SSL', false)
    ? { rejectUnauthorized: false }
    : false,
});
