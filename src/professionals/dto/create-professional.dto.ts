import { ArrayMaxSize, ArrayNotEmpty, IsBoolean, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsPositive, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWorkingDay } from '../interfaces/configuration.interface';
import { PROFESSIONAL_CONFIG } from 'src/config/professional.config';

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
  @IsNotEmpty({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.available.isNotEmpty })
  @IsBoolean({ message: PROFESSIONAL_CONFIG.validation.createProfessionalDto.available.isBoolean })
  available: boolean;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @IsString()
  specialization: string;

  @IsNotEmpty()
  @IsString()
  titleAbbreviation: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Configuration)
  configuration: Configuration;
}
