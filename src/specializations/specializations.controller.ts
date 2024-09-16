import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSpecializationDto } from '@specializations/dto/create-specialization.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { SpecializationsService } from '@specializations/specializations.service';
import { UpdateSpecializationDto } from '@specializations/dto/update-specialization.dto';

@Controller('specializations')
export class SpecializationsController {
  constructor(private readonly specializationsService: SpecializationsService) {}

  @Post()
  create(@Body() createSpecializationDto: CreateSpecializationDto): Promise<IResponse> {
    return this.specializationsService.create(createSpecializationDto);
  }

  @Get()
  findAll(): Promise<IResponse> {
    return this.specializationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.specializationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecializationDto: UpdateSpecializationDto): Promise<IResponse> {
    return this.specializationsService.update(id, updateSpecializationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.specializationsService.remove(id);
  }
}
