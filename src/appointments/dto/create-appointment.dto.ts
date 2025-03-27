import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EStatus } from '@common/enums/status.enum';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from '@i18n/i18n.generated';

export class CreateAppointmentDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.professional.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.professional.isString') })
  professional: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.user.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.user.isString') })
  user: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.day.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.day.isString') })
  day: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.hour.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.hour.isString') })
  hour: string;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.slot.isInt') })
  slot: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.appointments.status.isString') })
  status: EStatus;
}
