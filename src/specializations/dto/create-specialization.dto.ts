import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SPECIALIZATIONS_CONFIG as SPEC_CONFIG } from '@config/specializations.config';

export class CreateSpecializationDto {
  @IsString({ message: SPEC_CONFIG.validation.isString.name })
  @IsNotEmpty({ message: SPEC_CONFIG.validation.isNotEmpty.name })
  name: string;

  @IsString({ message: SPEC_CONFIG.validation.isString.plural })
  @IsNotEmpty({ message: SPEC_CONFIG.validation.isNotEmpty.plural })
  plural: string;

  @IsString({ message: SPEC_CONFIG.validation.isString.description })
  @IsNotEmpty({ message: SPEC_CONFIG.validation.isNotEmpty.description })
  description: string;

  @IsString({ message: SPEC_CONFIG.validation.isString.area })
  @IsNotEmpty({ message: SPEC_CONFIG.validation.isNotEmpty.area })
  area: string;

  @IsString({ message: SPEC_CONFIG.validation.isString.icon })
  @IsNotEmpty({ message: SPEC_CONFIG.validation.isNotEmpty.icon })
  icon: string;

  @IsNumber({}, { message: SPEC_CONFIG.validation.isNumber.active })
  @IsIn([0, 1], { message: SPEC_CONFIG.validation.isIn.active })
  active: number;
}
