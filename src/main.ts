import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { Configuration, Environment } from './config/configuration';
import { ISOLogger } from './utils/logger';
import { setupSwagger } from './utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ISOLogger(),
  });
  const config = app.get<ConfigService<Configuration>>(ConfigService);

  app.use(helmet());
  app.enableCors({
    origin: config.get('CORS'),
    credentials: true,
  });

  if (config.get('NODE_ENV') === Environment.Development) {
    setupSwagger(app);
  }

  await app.listen(config.get('SERVER_PORT'));
}
bootstrap();
