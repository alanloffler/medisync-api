import { ArrayMaxSize, ArrayNotEmpty, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, Max, Min, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IWorkingDay } from '@professionals/interfaces/working-day.interface';

class WorkingDayDto {
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.workingDay.day.isInt') })
  @Min(0, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.workingDay.day.min') })
  @Max(6, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.workingDay.day.max') })
  day: number;

  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.workingDay.value.isBoolean') })
  value: boolean;
}

// Create a new DTO for unavailable time slots
class UnavailableTimeSlotDto {
  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.timeSlotUnavailableInit.isString') })
  @MinLength(5, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.timeSlotUnavailableInit.minLength') })
  timeSlotUnavailableInit?: string;

  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.timeSlotUnavailableEnd.isString') })
  @MinLength(5, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.timeSlotUnavailableEnd.minLength') })
  timeSlotUnavailableEnd?: string;
}

class Configuration {
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeInit.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeInit.isNotEmpty') })
  @MinLength(5, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeInit.minLength') })
  scheduleTimeInit: string;

  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeEnd.isString') })
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeEnd.isNotEmpty') })
  @MinLength(5, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeEnd.minLength') })
  scheduleTimeEnd: string;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.slotDuration.isInt') })
  @IsPositive({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.slotDuration.isPositive') })
  slotDuration: number;

  // Changed from direct properties to nested object
  @IsOptional()
  @IsObject({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.unavailableTimeSlot.isObject') })
  @ValidateNested()
  @Type(() => UnavailableTimeSlotDto)
  unavailableTimeSlot?: UnavailableTimeSlotDto;

  @ArrayNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.workingDays.arrayNotEmpty') })
  @ValidateNested({ each: true })
  @ArrayMaxSize(7, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.workingDays.arrayMaxSize') })
  @Type(() => WorkingDayDto)
  workingDays: IWorkingDay[];
}

export class CreateProfessionalDto {
  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.area.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.area.isString') })
  area: string;

  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.areaCode.isInt') })
  @Min(1, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.areaCode.min') }) // 1
  @Max(999, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.areaCode.max') }) // 000
  areaCode: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.available.isNotEmpty') })
  @IsBoolean({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.available.isBoolean') })
  available: boolean;

  @IsNotEmptyObject({}, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.scheduleTimeEnd.isNotEmpty') })
  @IsObject({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.configuration.isObject') })
  @ValidateNested()
  @Type(() => Configuration)
  configuration: Configuration;

  @IsOptional()
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.description.isString') })
  description: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.dni.isNotEmpty') })
  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.dni.isNumber') })
  dni: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.email.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.email.isString') })
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.email.isEmail') })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.firstName.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.firstName.isString') })
  firstName: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.lastName.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.lastName.isString') })
  lastName: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.phone.isNotEmpty') })
  @IsNumber({}, { message: i18nValidationMessage<I18nTranslations>('validation.professionals.phone.isNumber') })
  phone: number;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.specialization.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.specialization.isString') })
  specialization: string;

  @IsNotEmpty({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.title.isNotEmpty') })
  @IsString({ message: i18nValidationMessage<I18nTranslations>('validation.professionals.title.isString') })
  title: string;
}
