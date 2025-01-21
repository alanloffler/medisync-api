import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EMAIL_CONFIG } from '@config/email.config';
import { MaxFileSize } from '@/common/validators/max-size.validator';

export class sendEmailDto {
  @IsEmail({}, { message: EMAIL_CONFIG.validation.isEmail.to, each: true })
  to: string[];

  @IsString({ message: EMAIL_CONFIG.validation.isString.subject })
  subject: string;

  @IsString({ message: EMAIL_CONFIG.validation.isString.body })
  body: string;

  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  @MaxFileSize(10)
  path: string;
}