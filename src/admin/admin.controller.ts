import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { AdminService } from '@admin/admin.service';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';
import { UpdateAdminDto } from '@admin/dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<IResponse<Admin>> {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll(): Promise<IResponse<Admin[]>> {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
