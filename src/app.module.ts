import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfessionalsModule } from './professionals/professionals.module';
import { AreasModule } from './areas/areas.module';
import { SpecializationsModule } from './specializations/specializations.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'medisync',
      autoCreate: false,
    }),
    ProfessionalsModule,
    AppointmentsModule,
    AreasModule,
    SpecializationsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
