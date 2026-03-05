import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HttpErrorFilter } from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // Register global exception filter
  app.useGlobalFilters(new HttpErrorFilter());

  // Enable CORS if needed
  // app.enableCors();

  // Start listening on all interfaces (important for Docker/cloud deployment)
  await app.listen(3000, '0.0.0.0');
  console.log(`✓ Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
