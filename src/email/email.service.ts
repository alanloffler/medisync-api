import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import { sendEmailDto } from '@email/dto/sendEmail.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

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

  async sendEmail(dto: sendEmailDto): Promise<IResponse> {
    const { body, to, subject, attachments } = dto;
    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: to,
      subject: subject,
      html: body,
      attachments: attachments ? attachments : undefined,
    };

    try {
      await transport.sendMail(options);

      return { message: this.i18nService.t('response.email.sent'), statusCode: HttpStatus.OK };
    } catch (error) {
      throw new HttpException(this.i18nService.t('exception.email.notSent'), HttpStatus.BAD_REQUEST);
    }
  }
}
