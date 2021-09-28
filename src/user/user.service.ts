import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import supertokens from 'supertokens-node';
import EmailPassword, { User } from 'supertokens-node/recipe/emailpassword';

export type NBoxUser = {
  displayName: string;
} & User;

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async createUser(email: string, password: string, displayName: string) {
    const res = await EmailPassword.signUp(email, password);

    if (res.status === 'OK' && res.user) {
      await this.databaseService.createUser({
        id: res.user.id,
        displayName,
      });

      return this.getUserByEmailOrId(res.user.id);
    }

    throw new Error(res.status);
  }

  async getUsers(): Promise<NBoxUser[]> {
    // TODO: fetch all users recursivly
    const { users: stUsers } = await supertokens.getUsersNewestFirst({
      limit: 500,
    });
    const dbUsers = await this.databaseService.users({});

    const mergedUsers: NBoxUser[] = stUsers.map((stUser) => {
      const dbUser = dbUsers.find((dbUser) => dbUser.id === stUser.user.id);
      return Object.assign(dbUser, stUser.user) as NBoxUser;
    });

    return mergedUsers;
  }

  async getUserByEmailOrId(emailOrId: string) {
    const isEmail = emailOrId.includes('@');

    const stUser = isEmail
      ? await EmailPassword.getUserByEmail(emailOrId)
      : await EmailPassword.getUserById(emailOrId);

    if (stUser) {
      const dbUser = await this.databaseService.user({
        id: stUser.id,
      });
      return Object.assign(dbUser, stUser) as NBoxUser;
    } else {
      return;
    }
  }

  async createUserPasswordResetUrl(userId: string) {
    const res = await EmailPassword.createResetPasswordToken(userId);
    const baseUrl = process.env.SUPERTOKENS_WEBSITE_DOMAIN || 'http://localhost:3001';

    if (res.status === 'OK') return `${baseUrl}/auth/reset-password?token=${res.token}`;
  }
}
