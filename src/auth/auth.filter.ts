import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Error } from 'supertokens-node';
import { errorHandler } from 'supertokens-node/framework/express';

@Catch(Error)
export class SupertokensExceptionFilter implements ExceptionFilter {
  private handler = errorHandler();

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    this.handler(exception, ctx.getRequest(), ctx.getResponse(), ctx.getNext());
  }
}
