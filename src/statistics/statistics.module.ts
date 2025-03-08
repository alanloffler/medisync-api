import { Module } from '@nestjs/common';
import { AppointmentsModule } from '@appointments/appointments.module';
import { StatisticsController } from '@statistics/statistics.controller';
import { StatisticsService } from '@statistics/statistics.service';

@Module({
  controllers: [StatisticsController],
  imports: [AppointmentsModule],
  providers: [StatisticsService],
})
export class StatisticsModule {}
