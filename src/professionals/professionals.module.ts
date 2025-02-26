import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsModule } from '@appointments/appointments.module';
import { Professional, ProfessionalSchema } from '@professionals/schema/professional.schema';
import { ProfessionalsController } from '@professionals/professionals.controller';
import { ProfessionalsService } from '@professionals/professionals.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Professional.name, schema: ProfessionalSchema }]), AppointmentsModule],
  controllers: [ProfessionalsController],
  providers: [ProfessionalsService],
  exports: [MongooseModule],
})
export class ProfessionalsModule {}
