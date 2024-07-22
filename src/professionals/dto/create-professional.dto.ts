import { ArrayMaxSize, ArrayNotEmpty, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWorkingDay } from '../interfaces/configuration.interface';
import { PROFESSIONAL_CONFIG } from '../../config/professional.config';

class WorkingDayDto {
  @IsInt({ message: PROFESSIONAL_CONFIG.validation.workingDays.day.isInt })
  @Min(0, { message: PROFESSIONAL_CONFIG.validation.workingDays.day.min })
  @Max(5, { message: PROFESSIONAL_CONFIG.validation.workingDays.day.max })
  day: number;

  @IsBoolean({ message: PROFESSIONAL_CONFIG.validation.workingDays.value.isBoolean })
  value: boolean;
}

class Configuration {
  @IsString({ message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeInit.isString })
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeInit.isNotEmpty })
  @MinLength(5, { message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeInit.minLength })
  scheduleTimeInit: string;

  @IsString({ message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeEnd.isString })
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeEnd.isNotEmpty })
  @MinLength(5, { message: PROFESSIONAL_CONFIG.validation.configuration.scheduleTimeEnd.minLength })
  scheduleTimeEnd: string;

  @IsInt({ message: PROFESSIONAL_CONFIG.validation.configuration.slotDuration.isInt })
  @IsPositive({ message: PROFESSIONAL_CONFIG.validation.configuration.slotDuration.isPositive })
  slotDuration: number;

  @IsString({ message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableInit.isString })
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableInit.isNotEmpty })
  @MinLength(5, { message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableInit.minLength })
  timeSlotUnavailableInit: string;

  @IsString({ message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableEnd.isString })
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableEnd.isNotEmpty })
  @MinLength(5, { message: PROFESSIONAL_CONFIG.validation.configuration.timeSlotUnavailableEnd.minLength })
  timeSlotUnavailableEnd: string;

  @ArrayNotEmpty({ message: PROFESSIONAL_CONFIG.validation.workingDays.arrayNotEmpty })
  @ValidateNested({ each: true })
  @ArrayMaxSize(6, { message: PROFESSIONAL_CONFIG.validation.workingDays.minLength })
  @Type(() => WorkingDayDto)
  workingDays: IWorkingDay[];
}

export class CreateProfessionalDto {
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.area.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.area.isString })
  area: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.available.isNotEmpty })
  @IsBoolean({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.available.isBoolean })
  available: boolean;

  @IsNotEmptyObject({}, { message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.configuration.isNotEmptyObject })
  @IsObject({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.configuration.isObject })
  @ValidateNested()
  @Type(() => Configuration)
  configuration: Configuration;

  @IsOptional()
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.description.isString })
  description: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.dni.isNotEmpty })
  @IsNumber({}, { message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.dni.isNumber })
  dni: number;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.email.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.email.isString })
  @IsEmail({}, { message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.email.isEmail })
  email: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.firstName.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.firstName.isString })
  firstName: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.lastName.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.lastName.isString })
  lastName: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.phone.isNotEmpty })
  @IsNumber({}, { message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.phone.isNumber })
  phone: number;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.specialization.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.specialization.isString })
  specialization: string;

  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.titleAbbreviation.isNotEmpty })
  @IsString({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.titleAbbreviation.isString })
  titleAbbreviation: string;
}
