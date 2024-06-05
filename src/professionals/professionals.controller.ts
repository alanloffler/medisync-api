import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

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
  findAll(): Promise<Professional[]> {
    return this.professionalsService.findAll();
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
