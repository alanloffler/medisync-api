import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { TitlesService } from '@titles/titles.service';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Post()
  create(@Body() createTitleDto: CreateTitleDto): Promise<IResponse> {
    return this.titlesService.create(createTitleDto);
  }

  @Get()
  findAll(): Promise<IResponse> {
    return this.titlesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.titlesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTitleDto: UpdateTitleDto): Promise<IResponse> {
    return this.titlesService.update(id, updateTitleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.titlesService.remove(id);
  }
}
