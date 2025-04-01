import { Body, Controller, Post } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { EmailService } from '@email/email.service';
import { sendEmailDto } from '@email/dto/sendEmail.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() dto: sendEmailDto): Promise<IResponse> {
    return await this.emailService.sendEmail(dto);
  }
}
