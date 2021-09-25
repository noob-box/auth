import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UserService) {
    supertokens.init({
      supertokens: {
        connectionURI: 'http://localhost:3567',
      },
      appInfo: {
        appName: 'noob-box Auth',
        apiDomain: 'http://localhost:3000',
        websiteDomain: 'http://localhost:3001',
      },
      recipeList: [
        EmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'displayName',
              },
            ],
          },
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

                  const user = await userService.user({
                    id: userId,
                  });

                  input.jwtPayload = {
                    ...input.jwtPayload,
                    role: user.role,
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
        }),
      ],
    });
  }
}
