import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Specialization, SpecializationSchema } from '@specializations/schema/specializations.schema';
import { SpecializationsController } from '@specializations/specializations.controller';
import { SpecializationsService } from '@specializations/specializations.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Specialization.name, schema: SpecializationSchema }])],
  controllers: [SpecializationsController],
  providers: [SpecializationsService],
})
export class SpecializationsModule {}
