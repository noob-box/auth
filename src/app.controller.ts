import { Controller, Get, Header, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { Roles } from './auth/roles.decorator';
import { Role } from '.prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sessioninfo')
  async getSessionInfo(@Session() session: SessionContainer): Promise<string> {
    const test = await session.getTimeCreated();

    return JSON.stringify(test);
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  async getAdmin(): Promise<string> {
    return "Yes, you're admin";
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain')
  getRobots(): string {
    return 'User-agent: *\nDisallow: /';
  }
}
