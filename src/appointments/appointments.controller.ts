import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { AppointmentsService } from '@appointments/appointments.service';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';
import { IResponse } from '@common/interfaces/response.interface';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<IResponse> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll(): Promise<IResponse> {
    return this.appointmentsService.findAll();
  }

  @Get('byProfessional')
  findAllByProfessional(@Query('id') id: string, @Query('day') day: string): Promise<IResponse> {
    return this.appointmentsService.findAllByProfessional(id, day);
  }

  @Get('byUser')
  findAllByUser(@Query('id') id: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUser(id);
  }

  @Get('byUserAndProfessional')
  findAllByUserAndProfessional(@Query('user') userId: string, @Query('professional') professionalId: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUserAndProfessional(userId, professionalId);
  }

  @Get('byUserAndYear')
  findAllByUserAndYear(@Query('u') user: string, @Query('y') year: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUserAndYear(user, year);
  }

  @Get('yearsByUser')
  findApposYearsByUser(@Query('u') user: string): Promise<IResponse> {
    return this.appointmentsService.findApposYearsByUser(user);
  }

  @Get('monthsByUser')
  findApposMonthsByUser(@Query('u') user: string, @Query('y') year: string): Promise<IResponse> {
    return this.appointmentsService.findApposMonthsByUser(user, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse> {
    return this.appointmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.appointmentsService.remove(id);
  }
}
