import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { SafeUser } from '../users/models/safe-user';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/role.guard';
import { GetUserQuery } from './models/get-user-query.dto';
import { CreateUserRequest } from './models/create-user-request.dto';
import { UserResponse } from '../shared/models/user-response.dto';

@Controller('admin')
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Administration')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  async getUsers(): Promise<UserResponse[]> {
    return this.userService.findAll();
  }

  @Get('user')
  async getUser(@Query() query: GetUserQuery): Promise<UserResponse> {
    return this.userService.findOneByEmail(query.email);
  }

  @Post('user')
  async postUser(@Body() body: CreateUserRequest): Promise<SafeUser> {
    return this.userService.create(body.email, body.password, body.name, body.role);
  }
}
