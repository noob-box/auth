import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, UserService, DatabaseService],
  exports: [],
  controllers: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      providers: [],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
