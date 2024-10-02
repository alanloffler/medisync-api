import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { ProfessionalsService } from '@professionals/professionals.service';
import { UpdateProfessionalDto } from '@professionals/dto/update-professional.dto';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private readonly professionalsService: ProfessionalsService) {}

  @Post()
  create(@Body() createProfessionalDto: CreateProfessionalDto): Promise<IResponse> {
    return this.professionalsService.create(createProfessionalDto);
  }
  // TODO: implement search by specialization and area, and by professional data
  @Get('specialization/:id')
  findBySpecialization(@Param('id') id: string): Promise<string> {
    return this.professionalsService.findBySpecialization(id);
  }
  // TODO: apply IResponse on this method, also on service
  @Get()
  findAll(
    @Query('search') search: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
    @Query('sk') sortingKey: string,
    @Query('sv') sortingValue: string,
  ) {
    return this.professionalsService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('active')
  findAllActive(): Promise<IResponse> {
    return this.professionalsService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.professionalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse> {
    return this.professionalsService.update(id, updateProfessionalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.professionalsService.remove(id);
  }
}
