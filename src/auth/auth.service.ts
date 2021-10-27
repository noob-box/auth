import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SafeUser } from '../users/models/safe-user';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findOneByEmailAndValidate(email, password);
    return user;
  }

  getSignedJWT(user: SafeUser): string {
    const { id: sub, email, name, role } = user;
    const payload = {
      sub,
      email,
      name,
      role,
    };

    return this.jwtService.sign(payload);
  }
}
