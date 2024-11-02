import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('countAppointments')
  countAppointments() {
    return this.dashboardService.countAppointments();
  }
}
