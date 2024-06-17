import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Configuration {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  scheduleTimeInit: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  scheduleTimeEnd: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  timeSlotUnavailableInit: string;
  
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  timeSlotUnavailableEnd: string;
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
