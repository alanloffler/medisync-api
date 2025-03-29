import { Controller, Get, Query } from '@nestjs/common';
import type { IApposChart } from '@dashboard/interfaces/appos-chart.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { DashboardService } from '@dashboard/dashboard.service';
import { User } from '@users/schema/user.schema';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // * CHECKED
  @Get('apposDaysCount')
  apposDaysCount(@Query('d') days: string): Promise<IResponse<IApposChart[]>> {
    return this.dashboardService.apposDaysCount(days);
  }

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

  // * CHECKED
  @Get('countProfessionals')
  countProfessionals(): Promise<IResponse<number>> {
    return this.dashboardService.countProfessionals();
  }

  // * CHECKED
  @Get('countProfessionalsLastMonth')
  countProfessionalsLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countProfessionalsLastMonth();
  }

  // * CHECKED
  @Get('countUsers')
  countUsers(): Promise<IResponse<number>> {
    return this.dashboardService.countUsers();
  }

  // * CHECKED
  @Get('countUsersLastMonth')
  countUsersLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countUsersLastMonth();
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
}
