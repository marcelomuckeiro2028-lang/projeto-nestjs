import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { parseCorsWhitelist } from './common/utils/parse-cors-whitelist';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  const corsWhitelist = parseCorsWhitelist(process.env.CORS_WHITELIST ?? '');

  app.enableCors({
    origin: (origin: string | undefined, callback: (...args: any[]) => void) => {
      if (!origin || corsWhitelist.includes(origin)) {
        return callback(null, true); // Permitir a requisição
      }

      // Requisições com origin mas que não conhecemos
      // Negamos
      return callback(new Error('Not allowed by CORS'), false);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não validadas
      forbidNonWhitelisted: true, // Retorna erro se houver propriedades não validadas
    }),
  );

  // Arquivos estáticos públicos
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  await app.listen(process.env.APP_PORT || 3001);
}
bootstrap();
