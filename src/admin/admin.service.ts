import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import supertokens from 'supertokens-node';
import Emailpassword, { User } from 'supertokens-node/recipe/emailpassword';

type NBoxUser = {
  displayName: string;
} & User;

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}
  async createUser(username: string, password: string, displayName: string) {
    const res = await Emailpassword.signUp(username, password);

    if (res.status === 'OK' && res.user) {
      await this.userService.createUser({
        id: res.user.id,
        displayName,
      });
    }

    return res.status;
  }

  async getUsers(): Promise<NBoxUser[]> {
    const { users: stUsers } = await supertokens.getUsersNewestFirst({
      limit: 500,
    });
    const dbUsers = await this.userService.users({});

    const mergedUsers: NBoxUser[] = stUsers.map((stUser) => {
      const dbUser = dbUsers.find((dbUser) => dbUser.id === stUser.user.id);
      return Object.assign(dbUser, stUser.user) as NBoxUser;
    });

    return mergedUsers;
  }

  async getUserByEmailOrId(emailOrId: string) {
    const isEmail = emailOrId.includes('@');

    const stUser = isEmail
      ? await Emailpassword.getUserByEmail(emailOrId)
      : await Emailpassword.getUserById(emailOrId);

    if (stUser) {
      const dbUser = await this.userService.user({
        id: stUser.id,
      });
      return Object.assign(dbUser, stUser) as NBoxUser;
    } else {
      return;
    }
  }
}
