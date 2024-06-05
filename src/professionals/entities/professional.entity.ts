import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Professional {
  @IsNotEmpty()
  @IsNumber()
  available: number;

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
