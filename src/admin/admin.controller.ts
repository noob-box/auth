import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/models/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/role.guard';

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
  async getUser(@Query('email') email): Promise<UserDto> {
    return this.userService.findOneByEmail(email);
  }

  // @Post('user')
  // async postUser(
  //   @Body('email') email: string,
  //   @Body('displayName') displayName: string,
  // ): Promise<UserDto> {
  //   return this.userService.create(email, uuidv4(), displayName);
  // }
}
