import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  Validate,
  validateSync,
  ValidationError,
} from 'class-validator';
import { CorsValidator } from '../utils/validators/cors.validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class Configuration {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsUrl({ protocols: ['postgresql'], require_protocol: false, require_tld: false })
  DATABASE_URL: string;

  @IsInt()
  @Min(1)
  @Max(65_535)
  SERVER_PORT = 3000;

  @IsNotEmpty()
  @Validate(CorsValidator)
  CORS = '*';

  @MinLength(32)
  JWT_SECRET: string;

  // eslint-disable-next-line unicorn/better-regex
  @Matches(/^\d+(s|m|h|d|w|y)$/)
  JWT_EXPIRY = '7d';
}

const getValidatedConfiguration = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(Configuration, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    stopAtFirstError: true,
  });

  if (errors.length > 0) throw new ConfigValidationError(errors);

  return validatedConfig;
};

class ConfigValidationError extends Error {
  public readonly validationErrors: ValidationError[];

  constructor(validationErrors: ValidationError[]) {
    super();

    this.validationErrors = validationErrors;
  }
}

export { getValidatedConfiguration, Configuration, Environment, ConfigValidationError };
