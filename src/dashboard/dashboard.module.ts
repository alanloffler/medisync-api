import { Module } from '@nestjs/common';
import { AppointmentsModule } from '@appointments/appointments.module';
import { DashboardController } from '@dashboard/dashboard.controller';
import { DashboardService } from '@dashboard/dashboard.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [AppointmentsModule, UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
