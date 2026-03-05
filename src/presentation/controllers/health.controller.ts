import { Controller, Get } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  async check() {
    const dbReachable = this.dataSource.isInitialized;
    return {
      status: dbReachable ? 'ok' : 'degraded',
      db: dbReachable ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
