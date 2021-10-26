import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/models/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/role.guard';
import { GetUserQuery } from './models/get-user-query.dto';
import { CreateUserBody } from './models/create-user-body.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Administration')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  async getUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get('user')
  async getUser(@Query() query: GetUserQuery): Promise<UserDto> {
    return this.userService.findOneByEmail(query.email);
  }

  @Post('user')
  async postUser(@Body() body: CreateUserBody): Promise<UserDto> {
    return this.userService.create(body.email, body.password, body.name, body.role);
  }
}
