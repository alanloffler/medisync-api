import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
