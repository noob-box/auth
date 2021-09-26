import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { DatabaseService } from './database/database.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { UserService } from './user/user.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: SupertokensExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserService,
  ],
})
export class AppModule {}
