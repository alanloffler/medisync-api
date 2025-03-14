import { Body, Controller, Post } from '@nestjs/common';
import type { ILogin } from '@auth/interface/login.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@auth/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<IResponse<ILogin>> {
    return this.authService.login(loginDto);
  }
}
