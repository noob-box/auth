import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MeController } from './me/me.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { getValidatedConfiguration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: getValidatedConfiguration,
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AdminModule,
  ],
  controllers: [AppController, MeController],
})
export class AppModule {}
