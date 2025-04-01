import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MaxFileSize } from '@common/validators/max-size.validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class sendEmailDto {
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.email.to'), each: true })
  to: string[];

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.email.subject') })
  subject: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.email.body') })
  body: string;

  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}

class AttachmentDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.email.attachment.filename.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.email.attachment.filename.isString') })
  filename: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.email.attachment.path.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.email.attachment.path.isString') })
  @MaxFileSize(10, { message: i18nValidationMessage<I18nTranslations>('validation.email.attachment.path.maxFileSize') })
  path: string;
}
