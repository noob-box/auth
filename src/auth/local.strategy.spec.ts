import { LocalStrategy } from './local.strategy';
import { AuthServiceMock } from '../../test/mocks/auth/auth.service.mock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const testUserResult = {
  email: 'test@example.com',
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'Test User',
  role: 'USER',
};

describe('LocalStrategy', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  describe('validate', () => {
    it('should return the user', async () => {
      const authServiceMock = new AuthServiceMock();
      const localStrategy = new LocalStrategy(authServiceMock);

      expect(await localStrategy.validate('test@example.com', 'testPassword')).toStrictEqual(
        testUserResult,
      );
    });

    it('should throw unauthorized exception if user is not found', async () => {
      const authServiceMock = new AuthServiceMock();
      authServiceMock.validateUser = jest.fn(() => {
        throw new NotFoundException();
      });
      const localStrategy = new LocalStrategy(authServiceMock);

      expect(localStrategy.validate('test@example.com', 'testPassword')).rejects.toThrow();
    });

    it('should throw unauthorized exception if password is wrong', () => {
      const authServiceMock = new AuthServiceMock();
      authServiceMock.validateUser = jest.fn(() => null);

      const localStrategy = new LocalStrategy(authServiceMock);

      expect(localStrategy.validate('test@example.com', 'testPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
