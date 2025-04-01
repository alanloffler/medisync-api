import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { Area } from '@areas/schema/areas.schema';
import { AreasService } from '@areas/areas.service';
import { CreateAreaDto } from '@areas/dto/create-area.dto';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UpdateAreaDto } from '@areas/dto/update-area.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto): Promise<IResponse<Area>> {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAll(): Promise<IResponse<Area[]>> {
    return this.areasService.findAll();
  }

  @Get('/active')
  findAllActive(): Promise<IResponse<Area[]>> {
    return this.areasService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<Area>> {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto): Promise<IResponse<Area>> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<Area>> {
    return this.areasService.remove(id);
  }
}
