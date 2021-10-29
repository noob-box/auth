import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Configuration } from '../config/configuration';
import { UserResponse } from '../shared/models/user-response.dto';
import { SafeUser } from '../users/models/safe-user';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginRequest } from './models/login-request.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginRequest })
  async login(
    @Req() { user }: { user: SafeUser },
    @Res() response: Response,
  ): Promise<UserResponse> {
    return this.handleSignInAndRefresh(user, response);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() { user }: { user: SafeUser },
    @Res() response: Response,
  ): Promise<UserResponse> {
    return this.handleSignInAndRefresh(user, response);
  }

  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Req() { user }: { user: SafeUser }): UserResponse {
    return user;
  }

  private async handleSignInAndRefresh(user: SafeUser, response: Response): Promise<SafeUser> {
    const accessTokenCookie = this.authService.getAccessTokenCookie(user);
    const refreshTokenCookie = this.authService.getRefreshTokenCookie(user);

    await this.authService.addRefreshTokenToUser(
      user.id,
      refreshTokenCookie.jwt,
      refreshTokenCookie.options.expires,
    );

    response.cookie(accessTokenCookie.name, accessTokenCookie.jwt, accessTokenCookie.options);
    response.cookie(refreshTokenCookie.name, refreshTokenCookie.jwt, refreshTokenCookie.options);
    response.send(user);

    return user;
  }
}
