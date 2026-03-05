import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '@shared/guards';

@ApiTags('Health')
@Controller('health')
@Public()
export class HealthController {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({
    status: 200,
    description: 'Service health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ok', 'degraded'] },
        db: { type: 'string', enum: ['connected', 'disconnected'] },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
  })
  async check() {
    let dbReachable = false;
    try {
      await this.dataSource.query('SELECT 1');
      dbReachable = true;
    } catch {
      dbReachable = false;
    }
    return {
      status: dbReachable ? 'ok' : 'degraded',
      db: dbReachable ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
