import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import type { IDBCount } from '@professionals/interfaces/db-count.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';
import { Professional } from '@professionals/schema/professional.schema';
import { ProfessionalsService } from '@professionals/professionals.service';
import { UpdateProfessionalDto } from '@professionals/dto/update-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto): Promise<IResponse<Professional>> {
    return this.professionalsService.create(createProfessionalDto);
  }

  @Get('specialization')
  findBySpecialization(@Query('id') id: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.professionalsService.findBySpecialization(id, limit, skip, sortingKey, sortingValue);
  }

  @Get()
  findAll(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.professionalsService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('active')
  findAllActive(): Promise<IResponse> {
    return this.professionalsService.findAllActive();
  }

  @Get('availableForChange')
  findAllAvailableForChange(@Query('day') day: string, @Query('hour') hour: string): Promise<IResponse<Professional[]>> {
    return this.professionalsService.findAllAvailableForChange(day, hour);
  }

  @Get('databaseCount')
  databaseCount(): Promise<IResponse<IDBCount>> {
    return this.professionalsService.databaseCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.professionalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse> {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  @Patch(':id/availability')
  updateAvailability(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse> {
    return this.professionalsService.updateAvailability(id, updateProfessionalDto.available);
  }

  // CHECKED: used on ProfessionalsDataTable.tsx
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.professionalsService.remove(id);
  }
}
