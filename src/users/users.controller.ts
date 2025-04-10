import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IUserStats } from './interfaces/user-stats.interface';
import type { IUsersData } from '@users/interfaces/users-data.interface';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';
import { UsersService } from '@users/users.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IResponse<User>> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse<IUsersData>> {
    return this.usersService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('byIdentityNumber')
  findAllByIdentityNumber(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse<IUsersData>> {
    return this.usersService.findAllByIdentityNumber(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('newUsersToday')
  newUsersToday(): Promise<IResponse<IUserStats>> {
    return this.usersService.newUsersToday();
  }

  @Roles([ERole.Super])
  @Get('removedUsers')
  findRemovedUsers(): Promise<IResponse<User[]>> {
    return this.usersService.findRemovedUsers();
  }

  @Patch('delete/:id')
  delete(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.delete(id);
  }

  @Roles([ERole.Super])
  @Patch('restore/:id')
  restore(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.restore(id);
  }

  @Roles([ERole.Super])
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IResponse<User>> {
    return this.usersService.update(id, updateUserDto);
  }
}
