import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { ERole } from '@common/enums/role.enum';
import { EmailService } from '@email/email.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { sendEmailDto } from '@email/dto/sendEmail.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() dto: sendEmailDto): Promise<IResponse> {
    return await this.emailService.sendEmail(dto);
  }
}
