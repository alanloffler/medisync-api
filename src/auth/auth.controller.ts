import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Auth } from '@common/decorators/auth.decorator';
import { AuthService } from '@auth/auth.service';
import { ERole } from '@common/enums/role.enum';
import { LoginDto } from '@auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<IResponse<IPayload>> {
    return this.authService.login(loginDto);
  }

  @Auth([ERole.Admin, ERole.Super])
  @Get('logout')
  logout(@Req() req: IRequest): Promise<IResponse<IPayload>> {
    return this.authService.logout(req);
  }
}
