// reflect-metadata needs to be in global scobe for class-transformer to work.
// Nest provides it at runtime
import 'reflect-metadata';
import {
  Configuration,
  ConfigValidationError,
  Environment,
  getValidatedConfiguration,
} from './configuration';

// Suppress validation error output
jest.mock('../utils/logger');

describe('Configuration', () => {
  describe('getValidatedConfiguration', () => {
    it('should return config given minimal valid input', async () => {
      const validEnvironmentInput = {
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImTheSuperSecretTestSecretYouKnow_123',
      };

      const expectedConfiguration = new Configuration();
      expectedConfiguration.DATABASE_URL = validEnvironmentInput.DATABASE_URL;
      expectedConfiguration.JWT_SECRET = validEnvironmentInput.JWT_SECRET;

      const validatedConfig = getValidatedConfiguration(validEnvironmentInput);

      expect(validatedConfig).toStrictEqual(expectedConfiguration);
    });

    it('should return config given all possible valid inputs', async () => {
      const validEnvironmentInput = {
        NODE_ENV: 'production',
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImTheSuperSecretTestSecretYouKnow_123',
        JWT_ACCESS_EXPIRY: 120,
        JWT_REFRESH_EXPIRY: 600,
        SERVER_PORT: 3000,
        CORS: 'localhost',
      };

      const expectedConfiguration = new Configuration();
      expectedConfiguration.NODE_ENV = Environment.Production;
      expectedConfiguration.DATABASE_URL = validEnvironmentInput.DATABASE_URL;
      expectedConfiguration.JWT_SECRET = validEnvironmentInput.JWT_SECRET;
      expectedConfiguration.JWT_ACCESS_EXPIRY = validEnvironmentInput.JWT_ACCESS_EXPIRY;
      expectedConfiguration.JWT_REFRESH_EXPIRY = validEnvironmentInput.JWT_REFRESH_EXPIRY;
      expectedConfiguration.JWT_SECRET = validEnvironmentInput.JWT_SECRET;

      const validatedConfig = getValidatedConfiguration(validEnvironmentInput);

      expect(validatedConfig).toStrictEqual(expectedConfiguration);
    });

    it('should throw a validation error on invalid input', async () => {
      const validEnvironmentInput = {
        DATABASE_URL: 'test:pass@localhost:5432/db',
        JWT_SECRET: 'ImToShort',
        JWT_EXPIRY: 'invalidData',
      };

      expect(() => getValidatedConfiguration(validEnvironmentInput)).toThrow(ConfigValidationError);
    });

    it('should throw a validation error on missing input', async () => {
      const validEnvironmentInput = {};

      expect(() => getValidatedConfiguration(validEnvironmentInput)).toThrow(ConfigValidationError);
    });
  });
});
