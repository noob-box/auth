import { plainToClass } from 'class-transformer';
import { IsEnum, IsInt, IsUrl, Matches, Max, Min, MinLength, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
}

class Configuration {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsUrl({ protocols: ['postgresql'], require_protocol: false, require_tld: false })
  DATABASE_URL: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  SERVER_PORT = 3000;

  @MinLength(32)
  JWT_SECRET: string;

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

  if (errors.length > 0) throw errors[0];

  return validatedConfig;
};

export { getValidatedConfiguration, Configuration, Environment };
