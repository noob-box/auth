import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { NBoxUser, UserService } from '../user/user.service';
import { Roles } from '../auth/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import UserPasswordResetUrlDto from './models/UserPasswordResetUrl.dto';

@Controller('admin')
@Roles(Role.ADMIN)
@ApiTags('Administration')
export class AdminController {
  constructor(private userService: UserService) {}

  @Get('users')
  async getUsers(): Promise<NBoxUser[]> {
    return this.userService.getUsers();
  }

  @Get('user')
  async getUser(@Param('emailOrId') emailOrId: string): Promise<NBoxUser> {
    return this.userService.getUserByEmailOrId(emailOrId);
  }

  @Post('user')
  async postUser(
    @Body('email') email: string,
    @Body('displayName') displayName: string,
  ): Promise<NBoxUser> {
    return this.userService.createUser(email, uuidv4(), displayName);
  }

  @Post('user/password-reset-url')
  async postUserPasswordResetUrl(@Body('userId') userId: string): Promise<UserPasswordResetUrlDto> {
    return {
      url: await this.userService.createUserPasswordResetUrl(userId),
    };
  }
}
