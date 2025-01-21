import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { json, raw, urlencoded } from 'express';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { formatValidationError } from '@common/validators/format-error';

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

  app.use(json({ limit: '15mb' }));
  app.use(raw({ limit: '15mb' }));
  app.use(urlencoded({ limit: '15mb', extended: true }));

  await app.listen(PORT);
}

bootstrap();
