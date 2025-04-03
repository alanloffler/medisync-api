import { IsBoolean, IsEmail, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.users.firstName.isString') })
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.users.firstName.minLength') })
  @MaxLength(30, { message: i18nValidationMessage<I18nTranslations>('validation.users.firstName.maxLength') })
  firstName: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.users.lastName.isString') })
  @MinLength(3, { message: i18nValidationMessage<I18nTranslations>('validation.users.lastName.minLength') })
  @MaxLength(30, { message: i18nValidationMessage<I18nTranslations>('validation.users.lastName.maxLength') })
  lastName: string;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.users.dni.isInt') })
  @Min(1000000, { message: i18nValidationMessage<I18nTranslations>('validation.users.dni.min') }) // 1 mill min
  @Max(99999999, { message: i18nValidationMessage<I18nTranslations>('validation.users.dni.max') }) // 99.99 mill max
  dni: number;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.users.areaCode.isInt') })
  @Min(1, { message: i18nValidationMessage<I18nTranslations>('validation.users.areaCode.min') }) // 1
  @Max(999, { message: i18nValidationMessage<I18nTranslations>('validation.users.areaCode.max') }) // 000
  areaCode: number;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.users.phone.isInt') })
  @Min(1000000000, { message: i18nValidationMessage<I18nTranslations>('validation.users.phone.min') }) // 0000 000000
  @Max(9999999999, { message: i18nValidationMessage<I18nTranslations>('validation.users.phone.max') }) // 0000 000000
  phone: number;

  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.users.email.isEmail') })
  email?: string;

  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.users.isDeleted.isBoolean') })
  isDeleted?: boolean;
}
