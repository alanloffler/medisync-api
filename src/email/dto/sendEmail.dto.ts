import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';
import { EMAIL_CONFIG } from '@config/email.config';
// import { Attachment } from 'nodemailer/lib/mailer';
import { IsBufferSizeValid } from '@/common/validators/buffer-size.validator';
import { Type } from 'class-transformer';

export class sendEmailDto {
  @IsEmail({}, { message: EMAIL_CONFIG.validation.isEmail.to, each: true })
  to: string[];

  @IsString({ message: EMAIL_CONFIG.validation.isString.subject })
  subject: string;

  @IsString({ message: EMAIL_CONFIG.validation.isString.body })
  body: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments: AttachmentDto[];
  //@MaxLength(100 * 1024 * 1024, { message: 'El archivo debe ser menor a 10MB' })
  // attachment?: Attachment[];
}

class AttachmentDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsNotEmpty()
  @IsBufferSizeValid(5)
  content: Buffer;
}