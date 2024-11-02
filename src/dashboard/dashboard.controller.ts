import { Controller, Get } from '@nestjs/common';
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
}
