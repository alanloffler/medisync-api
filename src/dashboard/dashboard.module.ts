import { Module } from '@nestjs/common';
import { AppointmentsModule } from '@appointments/appointments.module';
import { DashboardController } from '@dashboard/dashboard.controller';
import { DashboardService } from '@dashboard/dashboard.service';
import { ProfessionalsModule } from '@/professionals/professionals.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [AppointmentsModule, ProfessionalsModule, UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
