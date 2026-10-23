import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Arquivos estáticos públicos
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  await app.listen(3000);
}
bootstrap();
