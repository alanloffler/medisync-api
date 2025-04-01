import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';

export class CreateTitleDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.titles.name.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.titles.name.isString') })
  name: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.titles.abbreviation.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.titles.abbreviation.isString') })
  abbreviation: string;
}
