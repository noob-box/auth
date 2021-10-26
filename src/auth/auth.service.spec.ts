import { Role } from '.prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { jwtRegex } from '../../test/utils/regex';
import { UserDto } from '../users/models/user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');

const testEmail = 'test@example.com';
const testPassword = 'testPassword';
const testUserDto: UserDto = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  name: 'Test User',
  role: Role.USER,
};
const testUserJwtPayload = {
  sub: testUserDto.id,
  email: testUserDto.email,
  name: testUserDto.name,
  role: testUserDto.role,
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', async () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call UsersService with username and password and return a user', async () => {
      const mockFunction = jest.fn();
      mockFunction.mockResolvedValue(testUserDto);
      usersService.findOneByEmailAndValidate = mockFunction;

      expect(await authService.validateUser(testEmail, testPassword)).toBe(testUserDto);

      expect(usersService.findOneByEmailAndValidate).toHaveBeenCalledWith(
        'test@example.com',
        'testPassword',
      );
    });

    it('should reject on invalid user', async () => {
      const mockFunction = jest.fn();
      mockFunction.mockRejectedValue('error');
      usersService.findOneByEmailAndValidate = mockFunction;

      expect(authService.validateUser(testEmail, testPassword)).rejects.toBe('error');
    });
  });

  describe('login', () => {
    it('should call jwt sign with payload and return access token', async () => {
      jwtService.sign = jest
        .fn()
        .mockReturnValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNTllNDBlNS05NTZjLTQ2OGUtOTk4ZC1mN2IwYTg4NTQ1ZmUiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MzQ5ODY1MTksImV4cCI6MTYzNTU5MTMxOX0.J_P99MUqNCqlpiCwC1EpEcOamaTWJ8AKXFGvF6VwJH4',
        );

      const result = await authService.login(testUserDto);

      expect(jwtService.sign).toHaveBeenCalledWith(testUserJwtPayload);
      expect(result.accessToken).toMatch(jwtRegex);
    });
  });
});
