import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProfessionalDto {
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  area: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  specialization: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  titleAbbreviation: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phone: number;
}
