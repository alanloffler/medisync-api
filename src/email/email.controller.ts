import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from '@email/email.service';
import { sendEmailDto } from '@email/dto/sendEmail.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body() dto: sendEmailDto) {
    return await this.emailService.sendEmail(dto);
  }
}
