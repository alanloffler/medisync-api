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
  findAllByProfessional(
    @Query('id') id: string,
    @Query('day') day: string
  ): Promise<IResponse> {
    return this.appointmentsService.findAllByProfessional(id, day);
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
