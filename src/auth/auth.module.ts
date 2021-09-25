import { DynamicModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService, UserService, PrismaService],
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
