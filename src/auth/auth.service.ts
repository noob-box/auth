import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private databaseService: DatabaseService) {
    supertokens.init({
      supertokens: {
        connectionURI: process.env.SUPERTOKENS_CORE || 'http://localhost:3567',
      },
      appInfo: {
        appName: 'noob-box Auth',
        apiDomain: process.env.SUPERTOKENS_API_DOMAIN || 'http://localhost:3000',
        websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN || 'http://localhost:3001',
      },
      recipeList: [
        EmailPassword.init({
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                signUpPOST: undefined,
              };
            },
          },
        }),
        Session.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async (input) => {
                  const userId = input.userId;

                  const user = await this.databaseService.user({
                    id: userId,
                  });

                  input.jwtPayload = {
                    ...input.jwtPayload,
                    role: user.role,
                    displayName: user.displayName,
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
          errorHandlers: {
            onUnauthorised: (message, request, response) => {
              throw new UnauthorizedException(undefined, message);
            },
          },
        }),
      ],
    });
  }
}
