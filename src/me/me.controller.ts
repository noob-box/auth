import { Controller, Get, Session } from '@nestjs/common';
import { SessionContainer } from 'supertokens-node/recipe/session';
import SessionInfoDto from './models/SessionInfo.dto';

@Controller('me')
export class MeController {
  @Get('sessioninfo')
  async getSessionInfo(@Session() session: SessionContainer): Promise<SessionInfoDto> {
    const sessionInfo = {
      sessionHandle: session.getHandle(),
      userId: session.getUserId(),
      jwtPayload: session.getJWTPayload(),
      sessionData: await session.getSessionData(),
    };

    return sessionInfo;
  }
}
