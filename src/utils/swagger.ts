import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const setupSwagger = (app: INestApplication) => {
  const apiDocument = new DocumentBuilder()
    .setTitle('noob-box Auth')
    .setDescription('Authentication API for noob-box.net services')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, apiDocument);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'noob-box Auth API Reference',
    customCss: '.topbar { display: none; }',
  });
};

export { setupSwagger };
