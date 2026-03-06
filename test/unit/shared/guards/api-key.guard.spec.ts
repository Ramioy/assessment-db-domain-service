// @ts-nocheck
/* eslint-disable */
import { UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from '@shared/guards/api-key.guard';

describe('ApiKeyGuard', () => {
  let configService: { get: jest.Mock };
  let reflector: { getAllAndOverride: jest.Mock };
  let guard: ApiKeyGuard;

  const makeContext = (headers: Record<string, string> = {}, isPublic = false) => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({ headers }),
    }),
  });

  beforeEach(() => {
    configService = { get: jest.fn() };
    reflector = { getAllAndOverride: jest.fn() };
    guard = new ApiKeyGuard(configService as any, reflector as any);
  });

  it('allows request when API_KEY_ENABLED is false', () => {
    configService.get.mockReturnValue(false);
    const context = makeContext();

    const result = guard.canActivate(context as any);

    expect(result).toBe(true);
    expect(reflector.getAllAndOverride).not.toHaveBeenCalled();
  });

  it('allows request when route is marked @Public()', () => {
    configService.get.mockReturnValueOnce(true);
    reflector.getAllAndOverride.mockReturnValue(true);
    const context = makeContext();

    const result = guard.canActivate(context as any);

    expect(result).toBe(true);
  });

  it('allows request when valid API key is provided in x-api-key header', () => {
    configService.get.mockImplementation((key: string) =>
      key === 'API_KEY_ENABLED' ? true : 'secret-key',
    );
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = makeContext({ 'x-api-key': 'secret-key' });

    const result = guard.canActivate(context as any);

    expect(result).toBe(true);
  });

  it('throws UnauthorizedException when API key is missing', () => {
    configService.get.mockReturnValue(true);
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = makeContext({});

    expect(() => guard.canActivate(context as any)).toThrow(
      new UnauthorizedException('Invalid or missing API key'),
    );
  });

  it('throws UnauthorizedException when API key is invalid', () => {
    configService.get.mockImplementation((key: string) =>
      key === 'API_KEY_ENABLED' ? true : 'secret-key',
    );
    reflector.getAllAndOverride.mockReturnValue(false);
    const context = makeContext({ 'x-api-key': 'wrong-key' });

    expect(() => guard.canActivate(context as any)).toThrow(
      new UnauthorizedException('Invalid or missing API key'),
    );
  });
});
