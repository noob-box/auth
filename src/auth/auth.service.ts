import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from '../users/models/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findOneByEmailAndValidate(email, password);
    return user;
  }

  async login(user: UserDto) {
    const { id, ...additionalProps } = user;
    const payload = {
      sub: id,
      ...additionalProps,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
