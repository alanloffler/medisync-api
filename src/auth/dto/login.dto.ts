import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class LoginDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.admin.email.required') })
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.admin.email.invalid') })
  email: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.admin.password.isString') })
  @MinLength(8, { message: i18nValidationMessage<I18nTranslations>('validation.admin.password.minLength') })
  @MaxLength(100, { message: i18nValidationMessage<I18nTranslations>('validation.admin.password.maxLength') })
  @Transform(({ value }) => value.trim())
  password: string;
}
