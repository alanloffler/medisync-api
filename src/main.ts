import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, raw, urlencoded } from 'express';

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT) || 3000;

  const app: INestApplication = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: [process.env.FRONTEND_URL.toString(), process.env.PREVIEW_URL.toString()],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(json({ limit: '10mb' }));
  app.use(raw({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  await app.listen(PORT);
}

bootstrap();
