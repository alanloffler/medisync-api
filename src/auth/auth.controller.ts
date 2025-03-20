import type { Response } from 'express';
import { Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { AuthService } from '@auth/auth.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@auth/guards/local-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { ERole } from '@common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    return this.authService.loginWithCredentials(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    return this.authService.logout(req.user, res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([ERole.Super, ERole.Admin])
  @Post('refresh')
  refreshTokens(@Req() req: IRequest, @Res({ passthrough: true }) res: Response): Promise<IResponse<IPayload>> {
    const refreshToken = req.cookies?.refreshToken;
    console.log('Refresh token at controller', refreshToken);
    if (!refreshToken) throw new HttpException('Refresh token is required', HttpStatus.BAD_REQUEST);

    return this.authService.refreshTokens(req.user, refreshToken, res);
  }
}
