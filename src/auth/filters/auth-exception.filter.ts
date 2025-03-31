import type { Response } from 'express';
import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;
    const message = exceptionResponse.message || 'Unauthorized';

    response.status(status).json({
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
    });
  }
}
