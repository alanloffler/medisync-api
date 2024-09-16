import { PartialType } from '@nestjs/mapped-types';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {}
