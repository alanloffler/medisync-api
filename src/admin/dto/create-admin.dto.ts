import type { I18nTranslations } from '@i18n/i18n.generated';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ERole } from '@common/enums/role.enum';

export class CreateAdminDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.admin.firstName.isString') })
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.admin.firstName.minLength') })
  @MaxLength(30, { message: i18nValidationMessage<I18nTranslations>('validation.admin.firstName.maxLength') })
  firstName: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.admin.lastName.isString') })
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.admin.lastName.minLength') })
  @MaxLength(30, { message: i18nValidationMessage<I18nTranslations>('validation.admin.lastName.maxLength') })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(100, { message: 'Password must be at most 100 characters long' })
  @Transform(({ value }) => value.trim())
  password: string;

  @Transform(({ value }) => value.trim())
  @IsEnum(ERole, {
    message: (args) => `Invalid role: ${args.constraints[1].join(' | ')} is required`,
  })
  role: ERole;

  @IsOptional()
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken?: string;
}
