import { ArrayMaxSize, ArrayNotEmpty, IsBoolean, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsPositive, IsString, Max, Min, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWorkingDay } from '../interfaces/configuration.interface';
import { PROFESSIONAL_CONFIG } from 'src/config/professional.config';

class WorkingDayDto {
  @IsInt({ message: PROFESSIONAL_CONFIG.validation.day.message })
  @Min(0, { message: PROFESSIONAL_CONFIG.validation.day.min })
  @Max(5, { message: PROFESSIONAL_CONFIG.validation.day.max })
  day: number;

  @IsBoolean({ message: PROFESSIONAL_CONFIG.validation.value.message })
  value: boolean;
}

class Configuration {
  @IsString({ message: 'La hora de inicio de agenda debe ser hh:mm' })
  @IsNotEmpty({ message: 'La hora de inicio de agenda es obligatoria' })
  @MinLength(5, { message: 'La hora de inicio de agenda debe poseer 5 caracteres' })
  scheduleTimeInit: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  scheduleTimeEnd: string;

  @IsInt()
  @IsPositive()
  slotDuration: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  timeSlotUnavailableInit: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  timeSlotUnavailableEnd: string;

  @ArrayNotEmpty({ message: PROFESSIONAL_CONFIG.validation.workingDays.notEmptyArray })
  // @ValidateNested({ each: true })
  @ArrayMaxSize(6, { message: PROFESSIONAL_CONFIG.validation.workingDays.minLength })
  // @Length(6, 6, { message: PROFESSIONAL_CONFIG.validation.workingDays.minLength})
  @Type(() => WorkingDayDto)
  workingDays: IWorkingDay[];
}

export class CreateProfessionalDto {
  @IsNotEmpty()
  @IsBoolean()
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
