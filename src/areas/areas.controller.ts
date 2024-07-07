import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { AreasService } from './areas.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Post()
  create(@Body() createAreaDto: CreateAreaDto): Promise<IResponse> {
    return this.areasService.create(createAreaDto);
  }

  @Get()
  findAll(): Promise<IResponse> {
    return this.areasService.findAll();
  }

  @Get('/active')
  findAllActive(): Promise<IResponse> {
    return this.areasService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.areasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto): Promise<IResponse> {
    return this.areasService.update(id, updateAreaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.areasService.remove(id);
  }
}
