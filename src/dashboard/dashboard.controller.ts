import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from '@dashboard/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('countAppointments')
  countAppointments() {
    return this.dashboardService.countAppointments();
  }

  @Get('countAppointmentsLastMonth')
  countAppointmentsLastMonth() {
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

  @Get('latestAppointments')
  latestAppointments(@Query('l') limit: string) {
    return this.dashboardService.latestAppointments(limit);
  }

  @Get('latestUsers')
  latestUsers(@Query('l') limit: string) {
    return this.dashboardService.latestUsers(limit);
  }
}
