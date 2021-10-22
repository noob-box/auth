import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/models/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('local'))
@ApiTags('Administration')
export class AdminController {
  constructor(private readonly userService: UsersService) {}

  @Get('users')
  async getUsers(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Get('user')
  async getUserByEmail(@Param('email') email: string): Promise<UserDto> {
    return this.userService.findOneByEmail(email);
  }

  @Get('user')
  async getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOneById(id);
  }

  @Post('user')
  async postUser(
    @Body('email') email: string,
    @Body('displayName') displayName: string,
  ): Promise<UserDto> {
    return this.userService.create(email, uuidv4(), displayName);
  }
}
