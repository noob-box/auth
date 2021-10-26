import { Role } from '@prisma/client';
import { AuthService } from '../../../src/auth/auth.service';
import { LoginResponse } from '../../../src/auth/models/login-response.dto';
import { UserDto } from '../../../src/users/models/user.dto';

class AuthServiceMock extends AuthService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validateUser(email: string, password: string): Promise<UserDto> {
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: email,
      name: 'Test User',
      role: Role.USER,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(user: UserDto): Promise<LoginResponse> {
    return {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNTllNDBlNS05NTZjLTQ2OGUtOTk4ZC1mN2IwYTg4NTQ1ZmUiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJuYW1lIjoiVGVzdCBVc2VyIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE2MzQ5ODY1MTksImV4cCI6MTYzNTU5MTMxOX0.J_P99MUqNCqlpiCwC1EpEcOamaTWJ8AKXFGvF6VwJH4',
    };
  }
}

export { AuthServiceMock };
