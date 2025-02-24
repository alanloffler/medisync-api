import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '@appointments/schema/appointment.schema';
import { AppointmentsController } from '@appointments/appointments.controller';
import { AppointmentsService } from '@appointments/appointments.service';
import { UsersModule } from '@users/users.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]), UsersModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [MongooseModule],
})
export class AppointmentsModule {}
