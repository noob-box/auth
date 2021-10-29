import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SafeUser } from '../users/models/safe-user';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../config/configuration';
import { CookieOptions } from 'express';
import { Token } from '@prisma/client';

type JwtCookie = { name: string; jwt: string; options: CookieOptions };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  async validateUser(email: string, password: string): Promise<SafeUser> {
    const user = await this.usersService.findOneByEmailAndValidate(email, password);
    return user;
  }

  async addRefreshTokenToUser(id: string, token: string, expiryDate: Date): Promise<Token> {
    return await this.usersService.addUserRefreshToken(id, token, expiryDate);
  }

  getAccessToken(user: SafeUser): JwtCookie {
    const { id: sub, email, name, role } = user;
    const payload = {
      sub,
      email,
      name,
      role,
    };

    const expirySeconds = this.configService.get('JWT_ACCESS_EXPIRY');
    return this.createAuthCookie('sRefreshToken', payload, expirySeconds);
  }

  getRefreshToken(user: SafeUser): JwtCookie {
    const expirySeconds = this.configService.get('JWT_REFRESH_EXPIRY');
    return this.createAuthCookie('sRefreshToken', { sub: user.id }, expirySeconds);
  }

  private createAuthCookie(name: string, payload: object, expirySeconds: number): JwtCookie {
    const expiryDate = this.getExpiryDateFromSeconds(expirySeconds);

    return {
      name,
      jwt: this.jwtService.sign(payload, { expiresIn: expirySeconds }),
      options: {
        expires: expiryDate,
        domain: this.configService.get('COOKIE_DOMAIN'),
        httpOnly: true,
        secure: true,
      },
    };
  }

  private getExpiryDateFromSeconds(seconds: number) {
    return new Date(Date.now() + seconds);
  }
}
