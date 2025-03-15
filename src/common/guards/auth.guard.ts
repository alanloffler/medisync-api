import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const tokenExists = this.getTokenFromHeader(request);
    if (!tokenExists) throw new HttpException('Unauthorized - Token not found', HttpStatus.UNAUTHORIZED);

    try {
      const secret: string = this.configService.get<string>('JWT_ACCESS_SECRET');
      const payload = await this.jwtService.verifyAsync(tokenExists, { secret });
      request.user = payload;
    } catch (error) {
      throw new HttpException('Unauthorized - Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  private getTokenFromHeader(request: Request): string | undefined {
    const authorization: string | undefined = request.headers.authorization;
    if (!authorization) return undefined;

    const [bearer, token]: string[] = authorization.split(' ');
    return bearer === 'Bearer' ? token : undefined;
  }
}
