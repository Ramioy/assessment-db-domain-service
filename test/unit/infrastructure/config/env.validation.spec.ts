// @ts-nocheck
/* eslint-disable */
import { envValidationSchema } from '@infrastructure/config/env.validation';

describe('envValidationSchema', () => {
  const requiredFields = {
    DB_USERNAME: 'postgres',
    DB_PASSWORD: 'secret',
    DB_DATABASE: 'mydb',
  };

  it('validates a complete valid configuration', () => {
    const config = {
      ...requiredFields,
      NODE_ENV: 'production',
      PORT: 8080,
      HOST: '127.0.0.1',
      API_KEY_ENABLED: true,
      API_KEY: 'prod-secret',
      DB_HOST: 'db.example.com',
      DB_PORT: 5432,
      DB_SYNCHRONIZE: false,
      DB_LOGGING: true,
      DB_SSL: true,
    };

    const { error, value } = envValidationSchema.validate(config);

    expect(error).toBeUndefined();
    expect(value.DB_USERNAME).toBe('postgres');
    expect(value.NODE_ENV).toBe('production');
    expect(value.PORT).toBe(8080);
  });

  it('uses default values for optional fields', () => {
    const { error, value } = envValidationSchema.validate(requiredFields);

    expect(error).toBeUndefined();
    expect(value.NODE_ENV).toBe('development');
    expect(value.PORT).toBe(3000);
    expect(value.HOST).toBe('0.0.0.0');
    expect(value.LOG_LEVEL).toBe('debug');
    expect(value.CORS_ENABLED).toBe(true);
    expect(value.API_KEY_ENABLED).toBe(false);
    expect(value.DB_HOST).toBe('localhost');
    expect(value.DB_PORT).toBe(5432);
    expect(value.DB_SYNCHRONIZE).toBe(false);
    expect(value.DB_SSL).toBe(false);
    expect(value.ENABLE_SWAGGER).toBe(true);
  });

  it('rejects when required fields are missing', () => {
    const { error } = envValidationSchema.validate({});

    expect(error).toBeDefined();
    expect(error.message).toMatch(/DB_USERNAME/);
  });
});
