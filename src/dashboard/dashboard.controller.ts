import { Controller, Get, Query } from '@nestjs/common';
import type { IResponse } from '@common/interfaces/response.interface';
import { DashboardService } from '@dashboard/dashboard.service';
import { User } from '@users/schema/user.schema';
import { Appointment } from '@appointments/schema/appointment.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // * CHECKED
  @Get('countAppointments')
  countAppointments(): Promise<IResponse<number[]>> {
    return this.dashboardService.countAppointments();
  }

  // * CHECKED
  @Get('countAppointmentsLastMonth')
  countAppointmentsLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countAppointmentsLastMonth();
  }

  @Get('countUsers')
  countUsers() {
    return this.dashboardService.countUsers();
  }

  @Get('countUsersLastMonth')
  countUsersLastMonth() {
    return this.dashboardService.countUsersLastMonth();
  }

  @Get('countProfessionals')
  countProfessionals() {
    return this.dashboardService.countProfessionals();
  }

  @Get('countProfessionalsLastMonth')
  countProfessionalsLastMonth() {
    return this.dashboardService.countProfessionalsLastMonth();
  }

  // * CHECKED
  @Get('latestAppointments')
  latestAppointments(@Query('l') limit: string): Promise<IResponse<Appointment[]>> {
    return this.dashboardService.latestAppointments(limit);
  }

  // * CHECKED
  @Get('latestUsers')
  latestUsers(@Query('l') limit: string): Promise<IResponse<User[]>> {
    return this.dashboardService.latestUsers(limit);
  }

  @Get('apposDaysCount')
  apposDaysCount(@Query('d') days: string) {
    return this.dashboardService.apposDaysCount(days);
  }
}
