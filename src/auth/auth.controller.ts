import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import type { ITokens } from '@auth/interface/tokens.interface';
import { AuthService } from '@auth/auth.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: IRequest): Promise<IResponse<IPayload>> {
    return this.authService.loginWithCredentials(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: IRequest): Promise<IResponse<IPayload>> {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refreshTokens')
  refreshTokens(@Req() req: IRequest, @Body() tokens: ITokens): Promise<IResponse<IPayload>> {
    return this.authService.refreshTokens(req.user, tokens);
  }
}
