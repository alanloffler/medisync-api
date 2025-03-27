import type { I18nTranslations } from '@i18n/i18n.generated';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidationArguments } from 'class-validator';
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

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.admin.email.required') })
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.admin.email.invalid') })
  email: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.admin.password.isString') })
  @MinLength(8, { message: i18nValidationMessage<I18nTranslations>('validation.admin.password.minLength') })
  @MaxLength(100, { message: i18nValidationMessage<I18nTranslations>('validation.admin.password.maxLength') })
  @Transform(({ value }) => value.trim())
  password: string;

  @Transform(({ value }) => value.trim())
  @IsEnum(ERole, {
    message: (args: ValidationArguments) =>
      i18nValidationMessage<I18nTranslations>('validation.admin.role', {
        roles: args.constraints[1].join(', '),
      })(args),
  })
  role: ERole;

  @IsOptional()
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.admin.refreshToken.isString') })
  refreshToken?: string;
}
