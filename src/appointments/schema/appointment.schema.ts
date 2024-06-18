import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Professional } from '../../professionals/schema/professional.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Professional',
    default: {},
  })
  professional: Professional;

  @Prop()
  user: string;

  @Prop()
  day: string;

  @Prop()
  hour: string;

  @Prop()
  slot: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
