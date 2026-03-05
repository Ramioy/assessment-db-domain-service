import Joi from 'joi';

/**
 * Environment Variables Validation Schema
 * Validates all required and optional environment variables using Joi
 * Consistent with environment/development/example.env and environment/production/example.env
 */
export const envValidationSchema = Joi.object({
  // Application Environment
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  // Server Configuration
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('0.0.0.0'),

  // Logging Configuration
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose', 'silly')
    .default('debug'),

  // CORS Configuration
  CORS_ENABLED: Joi.boolean().default(true),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000,http://localhost:3001'),

  // API Configuration
  API_PREFIX: Joi.string().default('/api'),
  API_VERSION: Joi.string().default('v1'),

  // API Key Configuration
  API_KEY_ENABLED: Joi.boolean().default(false),
  API_KEY: Joi.string().default('your-development-secret-key-change-in-production'),

  // External Services (optional)
  EXTERNAL_API_URL: Joi.string().optional(),
  EXTERNAL_API_KEY: Joi.string().optional(),

  // Feature Flags
  ENABLE_SWAGGER: Joi.boolean().default(true),
  ENABLE_HEALTH_CHECK: Joi.boolean().default(true),

  // Application Information
  APP_NAME: Joi.string().default('your-service-name'),
  APP_DESCRIPTION: Joi.string().default('service-name-description'),
}).unknown(true);
