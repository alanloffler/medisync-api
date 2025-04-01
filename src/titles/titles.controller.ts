import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { Title } from '@titles/schema/title.schema';
import { TitlesService } from '@titles/titles.service';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Post()
  create(@Body() createTitleDto: CreateTitleDto): Promise<IResponse<Title>> {
    return this.titlesService.create(createTitleDto);
  }

  @Get()
  findAll(): Promise<IResponse<Title[]>> {
    return this.titlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<Title>> {
    return this.titlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTitleDto: UpdateTitleDto): Promise<IResponse<Title>> {
    return this.titlesService.update(id, updateTitleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<Title>> {
    return this.titlesService.remove(id);
  }
}
