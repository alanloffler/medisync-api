import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { CreateProfessionalDto } from './dto/create-professional.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { Professional } from './schema/professional.schema';
import { ProfessionalsService } from './professionals.service';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto): Promise<IResponse> {
    return this.professionalsService.create(createProfessionalDto);
  }

  @Get()
  findAll(
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
    @Query('sk') sortingKey: string,
    @Query('sv') sortingValue: string,
  ) {// volver a typear con interfaz nueva por el tema de la paginación
    return this.professionalsService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('active')
  findAllActive(): Promise<Professional[]> {
    return this.professionalsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Professional> {
    return this.professionalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto) {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionalsService.remove(id);
  }
}
