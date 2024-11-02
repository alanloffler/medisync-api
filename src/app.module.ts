import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from '@appointments/appointments.module';
import { AreasModule } from '@areas/areas.module';
import { ProfessionalsModule } from '@professionals/professionals.module';
import { SpecializationsModule } from '@specializations/specializations.module';
import { DashboardModule } from '@dashboard/dashboard.module';
import { TitlesModule } from '@titles/titles.module';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.DATABASE,
      autoCreate: false,
    }),
    AppointmentsModule,
    AreasModule,
    DashboardModule,
    ProfessionalsModule,
    SpecializationsModule,
    TitlesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
