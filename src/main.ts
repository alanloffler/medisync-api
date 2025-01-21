import { AppModule } from '@/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { formatValidationError } from '@common/validators/format-error';
import { json, raw, urlencoded } from 'express';

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT) || 3000;

  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL.toString(), process.env.PREVIEW_URL.toString()],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: formatValidationError,
    }),
  );

  app.use(json({ limit: '10mb' }));
  app.use(raw({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));

  await app.listen(PORT);
}

bootstrap();
