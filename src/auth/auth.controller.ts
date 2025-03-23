import type { Response } from 'express';
import { Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { AuthService } from '@auth/auth.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '@auth/guards/jwr-refresh-auth.guard';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    return this.authService.loginWithCredentials(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    return this.authService.logout(req.user, res);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  refreshTokens(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);

    return this.authService.refreshTokens(req.user, refreshToken, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getUser(@Req() req: IRequest): Promise<IResponse<Admin>> {
    return this.authService.getAdmin(req.user);
  }
}
