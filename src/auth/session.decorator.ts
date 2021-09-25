import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Session = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.session;
});
