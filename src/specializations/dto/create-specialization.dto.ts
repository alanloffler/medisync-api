import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class CreateSpecializationDto {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.name.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.name.isNotEmpty') })
  name: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.plural.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.plural.isNotEmpty') })
  plural: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.description.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.description.isNotEmpty') })
  description: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.area.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.area.isNotEmpty') })
  area: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.icon.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.specializations.icon.isNotEmpty') })
  icon: string;

  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.specializations.active.isNumber') })
  @IsIn([0, 1], { message: i18nValidationMessage<I18nTranslations>('validation.specializations.active.isIn') })
  active: number;
}
