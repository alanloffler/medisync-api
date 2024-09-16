import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Area, AreaSchema } from '@areas/schema/areas.schema';
import { AreasController } from '@areas/areas.controller';
import { AreasService } from '@areas/areas.service';
import { SpecializationsModule } from '@specializations/specializations.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }]), SpecializationsModule],
  controllers: [AreasController],
  providers: [AreasService],
})
export class AreasModule {}
