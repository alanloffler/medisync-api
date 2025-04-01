import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Title } from '@titles/schema/title.schema';
import { TitlesService } from '@titles/titles.service';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
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
