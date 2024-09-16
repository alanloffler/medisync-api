import { ArrayMaxSize, ArrayNotEmpty, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, Max, Min, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWorkingDay } from '@professionals/interfaces/configuration.interface';
import { PROFESSIONALS_CONFIG } from '@/config/professionals.config';

class WorkingDayDto {
  @IsInt({ message: PROFESSIONALS_CONFIG.validation.workingDays.day.isInt })
  @Min(0, { message: PROFESSIONALS_CONFIG.validation.workingDays.day.min })
  @Max(6, { message: PROFESSIONALS_CONFIG.validation.workingDays.day.max })
  day: number;

  @IsBoolean({ message: PROFESSIONALS_CONFIG.validation.workingDays.value.isBoolean })
  value: boolean;
}

class Configuration {
  @IsString({ message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeInit.isString })
  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeInit.isNotEmpty })
  @MinLength(5, { message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeInit.minLength })
  scheduleTimeInit: string;

  @IsString({ message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeEnd.isString })
  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeEnd.isNotEmpty })
  @MinLength(5, { message: PROFESSIONALS_CONFIG.validation.configuration.scheduleTimeEnd.minLength })
  scheduleTimeEnd: string;

  @IsInt({ message: PROFESSIONALS_CONFIG.validation.configuration.slotDuration.isInt })
  @IsPositive({ message: PROFESSIONALS_CONFIG.validation.configuration.slotDuration.isPositive })
  slotDuration: number;

  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsString({ message: PROFESSIONALS_CONFIG.validation.configuration.timeSlotUnavailableInit.isString })
  @MinLength(5, { message: PROFESSIONALS_CONFIG.validation.configuration.timeSlotUnavailableInit.minLength })
  timeSlotUnavailableInit?: string;

  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  @IsString({ message: PROFESSIONALS_CONFIG.validation.configuration.timeSlotUnavailableEnd.isString })
  @MinLength(5, { message: PROFESSIONALS_CONFIG.validation.configuration.timeSlotUnavailableEnd.minLength })
  timeSlotUnavailableEnd?: string;

  @ArrayNotEmpty({ message: PROFESSIONALS_CONFIG.validation.workingDays.arrayNotEmpty })
  @ValidateNested({ each: true })
  @ArrayMaxSize(7, { message: PROFESSIONALS_CONFIG.validation.workingDays.minLength })
  @Type(() => WorkingDayDto)
  workingDays: IWorkingDay[];
}

export class CreateProfessionalDto {
  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.area })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.area })
  area: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.available })
  @IsBoolean({ message: PROFESSIONALS_CONFIG.validation.dto.isBoolean.available })
  available: boolean;

  @IsNotEmptyObject({}, { message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.configuration })
  @IsObject({ message: PROFESSIONALS_CONFIG.validation.dto.isObject.configuration })
  @ValidateNested()
  @Type(() => Configuration)
  configuration: Configuration;

  @IsOptional()
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.description })
  description: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.dni })
  @IsNumber({}, { message: PROFESSIONALS_CONFIG.validation.dto.isNumber.dni })
  dni: number;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.email })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString .email})
  @IsEmail({}, { message: PROFESSIONALS_CONFIG.validation.dto.isEmail.email })
  email: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.firstName })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.firstName })
  firstName: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.lastName })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.lastName })
  lastName: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.phone })
  @IsNumber({}, { message: PROFESSIONALS_CONFIG.validation.dto.isNumber.phone })
  phone: number;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.specialization })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.specialization })
  specialization: string;

  @IsNotEmpty({ message: PROFESSIONALS_CONFIG.validation.dto.isNotEmpty.title })
  @IsString({ message: PROFESSIONALS_CONFIG.validation.dto.isString.title })
  title: string;
}
