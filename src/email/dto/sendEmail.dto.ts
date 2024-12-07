import { IsEmail, IsOptional, IsString } from 'class-validator';
import { EMAIL_CONFIG } from '@config/email.config';

export class sendEmailDto {
  @IsEmail({}, { message: EMAIL_CONFIG.validation.isEmail.recipients, each: true })
  recipients: string[];

  @IsString({ message: EMAIL_CONFIG.validation.isString.subject })
  subject: string;

  @IsString({ message: EMAIL_CONFIG.validation.isString.html })
  html: string;

  @IsOptional({ message: EMAIL_CONFIG.validation.isString.text })
  @IsString()
  text?: string;
}
