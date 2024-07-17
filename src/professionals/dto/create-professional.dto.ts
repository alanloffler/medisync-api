import { IsBoolean, IsInt, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsPositive, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IWorkingDay } from '../interfaces/configuration.interface';
// TODO dynamic error validation messages by config file
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
