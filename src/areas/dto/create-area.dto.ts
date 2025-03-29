import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class CreateAreaDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.areas.name.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.areas.name.isString') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.areas.plural.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.areas.plural.isString') })
  plural: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.areas.description.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.areas.description.isString') })
  description: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.areas.icon.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.areas.icon.isString') })
  icon: string;

  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.areas.active.isNumber') })
  @IsIn([0, 1], { message: i18nValidationMessage<I18nTranslations>('validation.areas.active.isIn') })
  active: number;
}
