import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EMAIL_CONFIG } from '@config/email.config';
import { sendEmailDto } from '@email/dto/sendEmail.dto';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html, text } = dto;
    const transport = this.emailTransport();
    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: recipients,
      subject,
      html,
      text,
    };

    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
      return { statusCode: 200, message: EMAIL_CONFIG.response.success.send };
    } catch (error) {
      console.log(`Error sending email: ${error}`);
      throw new HttpException(EMAIL_CONFIG.response.error.notSend, HttpStatus.BAD_REQUEST);
    }
  }
}
