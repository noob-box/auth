import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
class ISOLogger extends ConsoleLogger {
  getTimestamp() {
    return new Date().toISOString();
  }
}

export { ISOLogger };
