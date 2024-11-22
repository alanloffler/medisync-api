import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { UsersService } from '@users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IResponse> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.usersService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('byDNI')
  findAllByDNI(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.usersService.findAllByDNI(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('databaseCount')
  databaseCount(): Promise<IResponse> {
    return this.usersService.databaseCount();
  }

  @Get('countByMonth')
  countByMonth(@Query('m') month: string, @Query('y') year: string): Promise<IResponse> {
    return this.usersService.countByMonth(month, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IResponse> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.usersService.remove(id);
  }

  // Dashboard methods
  @Get('dashboard/countAll')
  countAll(): Promise<IResponse> {
    return this.usersService.countAll();
  }
}
