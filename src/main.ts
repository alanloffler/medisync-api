import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { formatValidationError } from '@common/validators/format-error';

async function bootstrap() {
  const PORT: number = parseInt(process.env.PORT) || 3000;

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: formatValidationError,
    }),
  );

  await app.listen(PORT);
}
bootstrap();
