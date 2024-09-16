import { PartialType } from '@nestjs/mapped-types';
import { CreateTitleDto } from '@titles/dto/create-title.dto';

export class UpdateTitleDto extends PartialType(CreateTitleDto) {}
