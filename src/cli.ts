#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { AdminService } from './admin/admin.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  const adminService = app.get(AdminService);

  const program = new Command();

  const userCommand = program.command('user').description('Manage users');

  userCommand
    .command('list')
    .description('Lists all users')
    .action(async () => {
      console.log(JSON.stringify(await adminService.getUsers()));
    });

  userCommand
    .command('create')
    .description('Creates a user')
    .argument('<username>')
    .argument('<password>')
    .argument('<displayName>')
    .action(async (username: string, password: string, displayName: string) => {
      console.log(JSON.stringify(await adminService.createUser(username, password, displayName)));
    });

  userCommand
    .command('get')
    .description('Get a specific user by email or id')
    .argument('<emailOrId>')
    .action(async (emailOrId: string) => {
      console.log(JSON.stringify(await adminService.getUserByEmailOrId(emailOrId)));
    });

  await program.parseAsync(process.argv);
}
bootstrap();
