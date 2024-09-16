import { AREA_CONFIG } from '@config/areas.config';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty({ message: AREA_CONFIG.validation.isNotEmpty.name })
  @IsString({ message: AREA_CONFIG.validation.isString.name })
  name: string;

  @IsNotEmpty({ message: AREA_CONFIG.validation.isNotEmpty.plural })
  @IsString({ message: AREA_CONFIG.validation.isString.plural })
  plural: string;

  @IsNotEmpty({ message: AREA_CONFIG.validation.isNotEmpty.description })
  @IsString({ message: AREA_CONFIG.validation.isString.description })
  description: string;

  @IsNumber({}, { message: AREA_CONFIG.validation.isNumber.active })
  @IsIn([0, 1], { message: AREA_CONFIG.validation.isIn.active })
  active: number;
}
