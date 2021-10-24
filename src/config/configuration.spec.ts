// reflect-metadata needs to be in global scobe for class-transformer to work.
// Nest provides it at runtime
import 'reflect-metadata';
import {
  Configuration,
  ConfigValidationError,
  Environment,
  getValidatedConfiguration,
} from './configuration';

describe('Configuration', () => {
  describe('getValidatedConfiguration', () => {
    it('should return config given minimal valid input', async () => {
      const validEnvInput = {
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImTheSuperSecretTestSecretYouKnow_123',
      };

      const expectedConfiguration = new Configuration();
      expectedConfiguration.DATABASE_URL = validEnvInput.DATABASE_URL;
      expectedConfiguration.JWT_SECRET = validEnvInput.JWT_SECRET;

      const validatedConfig = getValidatedConfiguration(validEnvInput);

      expect(validatedConfig).toStrictEqual(expectedConfiguration);
    });

    it('should return config given all possible valid inputs', async () => {
      const validEnvInput = {
        NODE_ENV: 'production',
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImTheSuperSecretTestSecretYouKnow_123',
        JWT_EXPIRY: '1w',
        SERVER_PORT: 3000,
      };

      const expectedConfiguration = new Configuration();
      expectedConfiguration.NODE_ENV = Environment.Production;
      expectedConfiguration.DATABASE_URL = validEnvInput.DATABASE_URL;
      expectedConfiguration.JWT_SECRET = validEnvInput.JWT_SECRET;
      expectedConfiguration.JWT_EXPIRY = validEnvInput.JWT_EXPIRY;
      expectedConfiguration.JWT_SECRET = validEnvInput.JWT_SECRET;

      const validatedConfig = getValidatedConfiguration(validEnvInput);

      expect(validatedConfig).toStrictEqual(expectedConfiguration);
    });

    it('should throw a validation error on invalid input', async () => {
      const validEnvInput = {
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImToShort',
        JWT_EXPIRY: 'invalidData',
      };

      expect(() => getValidatedConfiguration(validEnvInput)).toThrow(ConfigValidationError);
    });

    it('should throw a validation error on missing input', async () => {
      const validEnvInput = {};

      expect(() => getValidatedConfiguration(validEnvInput)).toThrow(ConfigValidationError);
    });
  });
});
