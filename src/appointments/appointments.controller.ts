import { Controller, Get, Post, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { AppointmentsService } from '@appointments/appointments.service';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}
  // CHECKED: used on DialogReserve.tsx
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<IResponse<Appointment>> {
    return this.appointmentsService.create(createAppointmentDto);
  }
  // CHECKED: used on appointments data table
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

  // CHECKED: used in ApposTable.tsx
  @Get('byFilters')
  findApposRecordWithFilters(@Query('u') userId: string, @Query('l') limit?: string, @Query('pg') page?: string, @Query('p') professionalId?: string, @Query('y') year?: string): Promise<IResponse> {
    return this.appointmentsService.findApposRecordWithFilters(userId, limit, page, professionalId, year);
  }
  // CHECKED: used on appointments data table
  @Get('count')
  countAppointments(): Promise<IResponse> {
    return this.appointmentsService.countAppointments();
  }
  // CHECKED: used on DateSelection.tsx
  @Get('daysWithAppos')
  daysWithAppos(@Query('professionalId') professionalId: string, @Query('year') year: string, @Query('month') month: string): Promise<IResponse> {
    return this.appointmentsService.daysWithAppos(professionalId, year, month);
  }
  // CHECKED: used on ApposFlowCard
  @Get('statistics')
  getApposStatistics(): Promise<IResponse> {
    return this.appointmentsService.getApposStatistics();
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

  // CHECKED: used on StatusSelect.tsx
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: { status: string }): Promise<IResponse<Appointment>> {
    return this.appointmentsService.update(id, dto);
  }
  // CHECKED: used on DialogReserve.tsx
  @Delete(':id')
  remove(@Param('id') id: string): Promise<IResponse> {
    return this.appointmentsService.remove(id);
  }
}
