import { Controller, Post, UseGuards, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Configuration } from '../config/configuration';
import { UserResponse } from '../shared/models/user-response.dto';
import { SafeUser } from '../users/models/safe-user';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginRequest } from './models/login-request.dto';
import { LoginResponse } from './models/login-response.dto';

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
    const jwt = this.authService.getSignedJWT(user);
    const expiryDate = new Date(Date.now() + this.configService.get('JWT_EXPIRY'));

    response.cookie('sAccessToken', jwt, {
      expires: expiryDate,
      domain: this.configService.get('COOKIE_DOMAIN'),
      httpOnly: true,
      secure: true,
    });

    response.send(user);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Req() { user }: { user: SafeUser }): UserResponse {
    return user;
  }
}
