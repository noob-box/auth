import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { UserService } from './user/user.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import { AdminService } from './admin/admin.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    UserService,
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
    AdminService,
  ],
})
export class AppModule {}
