import { APP_GUARD } from '@nestjs/core/constants';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '@admin/admin.module';
import { AppointmentsModule } from '@appointments/appointments.module';
import { AreasModule } from '@areas/areas.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { EmailModule } from '@email/email.module';
import { ProfessionalsModule } from '@professionals/professionals.module';
import { RolesGuard } from '@common/guards/roles.guard';
import { SpecializationsModule } from '@specializations/specializations.module';
import { StatisticsModule } from '@statistics/statistics.module';
import { TitlesModule } from '@titles/titles.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.DATABASE,
      autoCreate: false,
    }),
    AdminModule,
    AppointmentsModule,
    AreasModule,
    DashboardModule,
    EmailModule,
    ProfessionalsModule,
    SpecializationsModule,
    StatisticsModule,
    TitlesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
