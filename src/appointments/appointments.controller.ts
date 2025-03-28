import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import type { IAppoAttendance } from './interfaces/appo-attendance.interface';
import type { IApposDays } from '@appointments/interfaces/appos-days.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStatistic } from '@common/interfaces/statistic.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { AppointmentsService } from '@appointments/appointments.service';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';
import { Professional } from '@professionals/schema/professional.schema';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // * CHECKED: used on Frontend
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<IResponse<Appointment>> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  // * CHECKED: used on Frontend
  @Post('search')
  findSearch(@Body() dto: any): Promise<IResponse<Appointment[]>> {
    return this.appointmentsService.findSearch(dto);
  }

  // * CHECKED: used on Frontend
  @Get('byProfessional')
  findAllByProfessional(@Query('id') id: string, @Query('day') day: string): Promise<IResponse<Appointment[]>> {
    return this.appointmentsService.findAllByProfessional(id, day);
  }

  // * CHECKED: used on Frontend
  @Get('uniqueProfessionalsByUser')
  findUniqueProfessionalsByUser(@Query('u') id: string): Promise<IResponse<Professional[]>> {
    return this.appointmentsService.findUniqueProfessionalsByUser(id);
  }

  // * CHECKED: used on Frontend
  @Get('byFilters')
  findApposRecordWithFilters(@Query('u') userId: string, @Query('l') limit?: string, @Query('pg') page?: string, @Query('p') professionalId?: string, @Query('y') year?: string): Promise<IResponse<Appointment[]>> {
    return this.appointmentsService.findApposRecordWithFilters(userId, limit, page, professionalId, year);
  }

  // * CHECKED: used on Frontend
  @Get('count')
  countAppointments(): Promise<IResponse<number>> {
    return this.appointmentsService.countAppointments();
  }

  // * CHECKED: used on Frontend
  @Get('daysWithAppos')
  daysWithAppos(@Query('professionalId') professionalId: string, @Query('year') year: string, @Query('month') month: string): Promise<IResponse<IApposDays[]>> {
    return this.appointmentsService.daysWithAppos(professionalId, year, month);
  }

  // * CHECKED: used on Frontend
  @Get('statistics')
  getApposStatistics(): Promise<IResponse<IStatistic[]>> {
    return this.appointmentsService.getApposStatistics();
  }

  // * CHECKED: used on Frontend
  @Get('attendance')
  getAttendance(): Promise<IResponse<IAppoAttendance[]>> {
    return this.appointmentsService.getAttendance();
  }

  // * CHECKED: used on Frontend
  @Get('yearsByUser')
  findApposYearsByUser(@Query('u') user: string): Promise<IResponse<string[]>> {
    return this.appointmentsService.findApposYearsByUser(user);
  }

  // * CHECKED: used on Frontend
  @Get(':id')
  findOne(@Param('id') id: string): Promise<IResponse<Appointment>> {
    return this.appointmentsService.findOne(id);
  }

  // * CHECKED: used on Frontend
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { professional: string; status: string }): Promise<IResponse<Appointment>> {
    return this.appointmentsService.update(id, dto);
  }

  // * CHECKED: used on Frontend
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse<Appointment>> {
    return this.appointmentsService.remove(id);
  }
}
