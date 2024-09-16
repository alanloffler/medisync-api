import { IsNotEmpty, IsString } from 'class-validator';
import { TITLES_CONFIG } from '@/config/titles.config';

export class CreateTitleDto {
  @IsString({ message: TITLES_CONFIG.validation.isString.name })
  @IsNotEmpty({ message: TITLES_CONFIG.validation.isNotEmpty.name })
  name: string;

  @IsString({ message: TITLES_CONFIG.validation.isString.abbreviation })
  @IsNotEmpty({ message: TITLES_CONFIG.validation.isNotEmpty.abbreviation })
  abbreviation: string;
}
