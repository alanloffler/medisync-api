import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { AppointmentsService } from '@appointments/appointments.service';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';
import { ESearchType } from '@/common/enums/search-type.enum';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<IResponse> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Post('search')
  findSearch(@Body() dto: any): Promise<IResponse<Appointment[]>> {
    return this.appointmentsService.findSearch(dto);
  }

  @Get()
  findAll(@Query('p') page: string, @Query('l') limit: string): Promise<IResponse<Appointment[]>> {
    return this.appointmentsService.findAll(page, limit);
  }

  @Get('byProfessional')
  findAllByProfessional(@Query('id') id: string, @Query('day') day: string): Promise<IResponse> {
    return this.appointmentsService.findAllByProfessional(id, day);
  }

  @Get('byUser')
  findAllByUser(@Query('id') id: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUser(id);
  }

  @Get('uniqueProfessionalsByUser')
  findUniqueProfessionalsByUser(@Query('u') id: string): Promise<IResponse> {
    return this.appointmentsService.findUniqueProfessionalsByUser(id);
  }

  // WIP: this method will replace the next two methods
  @Get('byFilters')
  findApposRecordWithFilters(@Query('u') userId: string, @Query('p') professionalId?: string, @Query('y') year?: string): Promise<IResponse> {
    return this.appointmentsService.findApposRecordWithFilters(userId, professionalId, year);
  }
  // CHECKED: used on appointments data table
  @Get('count')
  countAppointments(): Promise<IResponse> {
    return this.appointmentsService.countAppointments();
  }

  // FIXME: both methods will be replaced by an unified method (previous method)
  @Get('byUserAndProfessional')
  findAllByUserAndProfessional(@Query('user') userId: string, @Query('professional') professionalId: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUserAndProfessional(userId, professionalId);
  }

  @Get('byUserAndYear')
  findAllByUserAndYear(@Query('u') user: string, @Query('y') year: string, @Query('m') month: string): Promise<IResponse> {
    return this.appointmentsService.findAllByUserAndYear(user, year, month);
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
