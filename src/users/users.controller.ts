import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IUserStats } from './interfaces/user-stats.interface';
import { Auth } from '@common/decorators/auth.decorator';
// import { AuthGuard } from '@common/guards/auth.guard';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { ERole } from '@common/enums/role.enum';
// import { Roles } from '@common/decorators/roles.decorator';
// import { RolesGuard } from '@common/guards/roles.guard';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';
import { UsersService } from '@users/users.service';

// Checked: all
// Typed response: todo findAll and findAllByIdentityNumber (reformulate type of response, then check in frontend)
// @UseGuards(AuthGuard)
@Auth([ERole.Super, ERole.Admin])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IResponse<User>> {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(RolesGuard)
  // @Roles([ERole.Admin, ERole.User])
  @Get()
  findAll(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.usersService.findAll(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('byIdentityNumber')
  findAllByIdentityNumber(@Query('search') search: string, @Query('limit') limit: string, @Query('skip') skip: string, @Query('sk') sortingKey: string, @Query('sv') sortingValue: string): Promise<IResponse> {
    return this.usersService.findAllByIdentityNumber(search, limit, skip, sortingKey, sortingValue);
  }

  @Get('newUsersToday')
  newUsersToday(): Promise<IResponse<IUserStats>> {
    return this.usersService.newUsersToday();
  }

  // @UseGuards(RolesGuard)
  // @Roles([ERole.User])
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<IResponse<User>> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<User>> {
    return this.usersService.remove(id);
  }
}
