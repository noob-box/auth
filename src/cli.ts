#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

function prettyJsonPrint(text: any) {
  console.log(JSON.stringify(text, null, 2));
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const usersService = app.get(UsersService);

  const program = new Command();

  const userCommand = program.command('user').description('Manage users');
  const userGetCommand = userCommand.command('get').description('Manage users');

  userCommand
    .command('list')
    .description('Lists all users')
    .action(async () => {
      prettyJsonPrint(await usersService.findAll());
    });

  userCommand
    .command('create')
    .description('Creates a user')
    .argument('<email>')
    .argument('<password>')
    .argument('<displayName>')
    .action(async (email: string, password: string, displayName: string) => {
      prettyJsonPrint(await usersService.create(email, password, displayName));
    });

  userGetCommand
    .command('id')
    .description('Get a specific user by id')
    .argument('<id>')
    .action(async (id: string) => {
      prettyJsonPrint(await usersService.findOneById(id));
    });

  userGetCommand
    .command('email')
    .description('Get a specific user by email')
    .argument('<email>')
    .action(async (email: string) => {
      prettyJsonPrint(await usersService.findOneByEmail(email));
    });

  await program.parseAsync(process.argv);
}
bootstrap();
