import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateSpecializationDto } from '@specializations/dto/create-specialization.dto';
import { Specialization } from '@specializations/schema/specializations.schema';
import { SpecializationsService } from '@specializations/specializations.service';
import { UpdateSpecializationDto } from '@specializations/dto/update-specialization.dto';

@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto): Promise<IResponse<Specialization>> {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Get()
  findAll(): Promise<IResponse<Specialization[]>> {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<Specialization>> {
    return this.specializationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecializationDto: UpdateSpecializationDto): Promise<IResponse<Specialization>> {
    return this.specializationsService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<Specialization>> {
    return this.specializationsService.remove(id);
  }
}
