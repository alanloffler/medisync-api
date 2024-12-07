import { IsEmail, IsString } from 'class-validator';
import { EMAIL_CONFIG } from '@config/email.config';

export class sendEmailDto {
  @IsEmail({}, { message: EMAIL_CONFIG.validation.isEmail.to, each: true })
  to: string[];

  @IsString({ message: EMAIL_CONFIG.validation.isString.subject })
  subject: string;

  @IsString({ message: EMAIL_CONFIG.validation.isString.body })
  body: string;
}
