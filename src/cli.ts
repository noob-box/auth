#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { UserService } from './user/user.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const userService = app.get(UserService);

  const program = new Command();

  const userCommand = program.command('user').description('Manage users');

  userCommand
    .command('list')
    .description('Lists all users')
    .action(async () => {
      console.log(JSON.stringify(await userService.getUsers()));
    });

  userCommand
    .command('create')
    .description('Creates a user')
    .argument('<username>')
    .argument('<password>')
    .argument('<displayName>')
    .action(async (username: string, password: string, displayName: string) => {
      console.log(JSON.stringify(await userService.createUser(username, password, displayName)));
    });

  userCommand
    .command('get')
    .description('Get a specific user by email or id')
    .argument('<emailOrId>')
    .action(async (emailOrId: string) => {
      console.log(JSON.stringify(await userService.getUserByEmailOrId(emailOrId)));
    });

  await program.parseAsync(process.argv);
}
bootstrap();
