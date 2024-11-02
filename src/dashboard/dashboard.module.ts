import { Module } from '@nestjs/common';
import { AppointmentsModule } from '@appointments/appointments.module';
import { DashboardController } from '@dashboard/dashboard.controller';
import { DashboardService } from '@dashboard/dashboard.service';

@Module({
  imports: [AppointmentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
