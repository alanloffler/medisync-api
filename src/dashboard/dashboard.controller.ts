import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import type { IApposChart } from '@dashboard/interfaces/appos-chart.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { DashboardService } from '@dashboard/dashboard.service';
import { ERole } from '@common/enums/role.enum';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { RolesGuard } from '@auth/guards/roles.guard';
import { User } from '@users/schema/user.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([ERole.Super, ERole.Admin])
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('apposDaysCount')
  apposDaysCount(@Query('d') days: string): Promise<IResponse<IApposChart[]>> {
    return this.dashboardService.apposDaysCount(days);
  }

  @Get('countAppointments')
  countAppointments(): Promise<IResponse<number[]>> {
    return this.dashboardService.countAppointments();
  }

  @Get('countAppointmentsLastMonth')
  countAppointmentsLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countAppointmentsLastMonth();
  }

  @Get('countProfessionals')
  countProfessionals(): Promise<IResponse<number>> {
    return this.dashboardService.countProfessionals();
  }

  @Get('countProfessionalsLastMonth')
  countProfessionalsLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countProfessionalsLastMonth();
  }

  @Get('countUsers')
  countUsers(): Promise<IResponse<number>> {
    return this.dashboardService.countUsers();
  }

  @Get('countUsersLastMonth')
  countUsersLastMonth(): Promise<IResponse<number>> {
    return this.dashboardService.countUsersLastMonth();
  }

  @Get('latestAppointments')
  latestAppointments(@Query('l') limit: string): Promise<IResponse<Appointment[]>> {
    return this.dashboardService.latestAppointments(limit);
  }

  @Get('latestUsers')
  latestUsers(@Query('l') limit: string): Promise<IResponse<User[]>> {
    return this.dashboardService.latestUsers(limit);
  }
}
