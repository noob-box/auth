import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('noob-box Auth')
    .setDescription('Authentication API for noob-box.net services')
    .addCookieAuth('sAccessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'noob-box Auth API Reference',
    customCss: '.topbar { display: none; }',
  });

  await app.listen(3000);
}
bootstrap();
