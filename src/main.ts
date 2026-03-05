import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const host = config.get<string>('HOST', '0.0.0.0');
  const apiPrefix = config.get<string>('API_PREFIX', '/api');
  const apiVersion = config.get<string>('API_VERSION', 'v1');
  const corsEnabled = config.get<boolean>('CORS_ENABLED', false);
  const corsOrigin = config.get<string>('CORS_ORIGIN', '');

  // Global API prefix: e.g. /api/v1
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // CORS via Fastify plugin
  if (corsEnabled) {
    const origins = corsOrigin
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean);
    await app.register(import('@fastify/cors'), {
      origin: origins.length > 0 ? origins : true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    });
  }

  // Global exception filter
  app.useGlobalFilters(new HttpErrorFilter());

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
