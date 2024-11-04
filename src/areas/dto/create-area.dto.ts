import { AREAS_CONFIG } from '@config/areas.config';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty({ message: AREAS_CONFIG.validation.isNotEmpty.name })
  @IsString({ message: AREAS_CONFIG.validation.isString.name })
  name: string;

  @IsNotEmpty({ message: AREAS_CONFIG.validation.isNotEmpty.plural })
  @IsString({ message: AREAS_CONFIG.validation.isString.plural })
  plural: string;

  @IsNotEmpty({ message: AREAS_CONFIG.validation.isNotEmpty.description })
  @IsString({ message: AREAS_CONFIG.validation.isString.description })
  description: string;

  @IsNotEmpty({ message: AREAS_CONFIG.validation.isNotEmpty.icon })
  @IsString({ message: AREAS_CONFIG.validation.isString.icon })
  icon: string;

  @IsNumber({}, { message: AREAS_CONFIG.validation.isNumber.active })
  @IsIn([0, 1], { message: AREAS_CONFIG.validation.isIn.active })
  active: number;
}
