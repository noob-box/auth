import { plainToClass, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  Validate,
  ValidateIf,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ISOLogger } from '../utils/logger';
import { hostNameRegex } from '../utils/regex';
import { CorsRegexValidator } from '../utils/validators/cors-regex.validator';
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

  @ValidateIf((x) => x.CORS_REGEX === undefined)
  @Validate(CorsValidator)
  CORS?: string = 'localhost';

  @ValidateIf((x) => x.CORS_REGEX !== undefined)
  @Validate(CorsRegexValidator)
  @Transform(({ value }) => new RegExp(value), { toClassOnly: true })
  CORS_REGEX?: RegExp;

  @MinLength(32)
  JWT_SECRET: string;

  // eslint-disable-next-line unicorn/better-regex
  @IsInt()
  JWT_EXPIRY = 604_800;

  @Matches(hostNameRegex, { message: '$property must be a valid hostname/domain' })
  COOKIE_DOMAIN = 'localhost';
}

const logValidationErrors = (errors: ValidationError[]) => {
  const logger = new ISOLogger(Configuration.name);

  for (const error of errors) {
    logger.error(`Validation error:
${error.property}: ${error.value}
Failed validations:
${JSON.stringify(error.constraints)}
`);
  }
};

const getValidatedConfiguration = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(Configuration, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    stopAtFirstError: true,
  });

  if (errors.length > 0) {
    logValidationErrors(errors);
    throw new ConfigValidationError(errors);
  }

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
