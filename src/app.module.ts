import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from './appointments/appointments.module';
import { AreasModule } from './areas/areas.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { TitlesModule } from './titles/titles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'medisync',
      autoCreate: false,
    }),
    AppointmentsModule,
    AreasModule,
    ProfessionalsModule,
    SpecializationsModule,
    TitlesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
