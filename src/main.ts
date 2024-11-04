import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { formatValidationError } from '@common/validators/format-error';

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT) || 3000;

  const app: INestApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.FRONTEND_URL, process.env.PREVIEW_URL],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: formatValidationError,
    }),
  );

  await app.listen(PORT);
}

bootstrap();
