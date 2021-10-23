import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Configuration, Environment } from './config/configuration';
import { ISOLogger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ISOLogger(),
  });
  const config = app.get<ConfigService<Configuration>>(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  if (config.get('NODE_ENV') === Environment.Development) {
    const apiDocument = new DocumentBuilder()
      .setTitle('noob-box Auth')
      .setDescription('Authentication API for noob-box.net services')
      .addCookieAuth('sAccessToken')
      .build();
    const document = SwaggerModule.createDocument(app, apiDocument);
    SwaggerModule.setup('docs', app, document, {
      customSiteTitle: 'noob-box Auth API Reference',
      customCss: '.topbar { display: none; }',
    });
  }

  await app.listen(config.get('SERVER_PORT'));
}
bootstrap();
