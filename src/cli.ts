#!/usr/bin/env node

import { NestFactory } from '@nestjs/core';
import { Command } from 'commander';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  const program = new Command();

  program.description('nbox Auth description');

  const userCommand = program.command('user').description('Manage users');

  userCommand.command('list').description('Lists all users');

  userCommand
    .command('create')
    .description('Creates a user')
    .argument('<username>')
    .argument('<password>');

  await program.parseAsync(process.argv);
}
bootstrap();
