import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, raw, urlencoded } from 'express';

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT) || 3000;

  const app: INestApplication = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.FRONTEND_URL.toString(), process.env.PREVIEW_URL.toString()],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-lang'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new I18nValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );

  app.use(json({ limit: '10mb' }));
  app.use(raw({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  await app.listen(PORT);
}

bootstrap();
