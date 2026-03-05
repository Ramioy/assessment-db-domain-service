// @ts-nocheck
/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@presentation/controllers/health.controller';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('HealthController', () => {
  let controller: HealthController;
  let mockDataSource: { query: jest.Mock };

  beforeEach(async () => {
    mockDataSource = { query: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    controller = module.get(HealthController);
    jest.clearAllMocks();
  });

  it('returns status ok and db connected when DB is reachable', async () => {
    mockDataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(result.db).toBe('connected');
    expect(typeof result.timestamp).toBe('string');
  });

  it('returns status degraded and db disconnected when DB query fails', async () => {
    mockDataSource.query.mockRejectedValue(new Error('Connection refused'));

    const result = await controller.check();

    expect(result.status).toBe('degraded');
    expect(result.db).toBe('disconnected');
  });

  it('always includes a timestamp in ISO format', async () => {
    mockDataSource.query.mockResolvedValue([]);

    const result = await controller.check();

    expect(() => new Date(result.timestamp)).not.toThrow();
  });
});
