import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecializationDto } from '@specializations/dto/create-specialization.dto';

export class UpdateSpecializationDto extends PartialType(CreateSpecializationDto) {}
