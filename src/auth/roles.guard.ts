import { Role } from '.prisma/client';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const session: SessionContainer = context.switchToHttp().getRequest().session;

    const userId = session.getUserId();
    const user = await this.userService.user({ id: userId });
    const role = user?.role;

    if (!requiredRoles || (role && requiredRoles.includes(role))) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
