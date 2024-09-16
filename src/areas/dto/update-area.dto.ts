import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaDto } from '@areas/dto/create-area.dto';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {}
