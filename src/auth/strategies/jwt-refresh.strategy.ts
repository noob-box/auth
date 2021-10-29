import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<Configuration>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: JwtRefreshStrategy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    const user = await this.usersService.findOneById(payload.sub);
    const token = request.cookies?.sRefreshToken;

    const isValidToken = await this.usersService.validateRefreshToken(user.id, token);

    if (!user || !isValidToken) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private static cookieExtractor(request: Request): string {
    const token = request?.cookies?.sRefreshToken ?? undefined;
    return token;
  }
}
