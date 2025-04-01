import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { AdminService } from '@admin/admin.service';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UpdateAdminDto } from '@admin/dto/update-admin.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
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
  findOne(@Param('id') id: string): Promise<IResponse<Admin>> {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto): Promise<IResponse<Admin>> {
    return this.adminService.update(id, updateAdminDto);
  }

  @Roles([ERole.Super])
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<Admin>> {
    return this.adminService.remove(id);
  }
}
