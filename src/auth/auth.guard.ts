import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    await verifySession()(ctx.getRequest(), ctx.getResponse(), (res) => {
      err = res;
    });

    if (err !== undefined) {
      throw err;
    }

    return true;
  }
}
