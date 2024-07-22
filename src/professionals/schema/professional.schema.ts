import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Specialization } from '../../specializations/schema/specializations.schema';
import { IConfiguration } from '../interfaces/configuration.interface';

export type ProfessionalDocument = HydratedDocument<Professional>;

@Schema({
  timestamps: true,
})
export class Professional {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Area',
    default: {},
  })
  area: string;

  @Prop({ default: true })
  available: boolean;

  @Prop({
    type: {
      scheduleTimeInit: { type: String, trim: true, required: true },
      scheduleTimeEnd: { type: String, trim: true, required: true },
      slotDuration: { type: Number, required: true },
      timeSlotUnavailableInit: { type: String, trim: true, required: true },
      timeSlotUnavailableEnd: { type: String, trim: true, required: true },
      workingDays: { type: [{ day: Number, value: Boolean }], required: true },
    },
  })
  configuration: IConfiguration;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop({ lowercase: true, trim: true })
  firstName: string;

  @Prop({ lowercase: true, trim: true })
  lastName: string;

  @Prop()
  phone: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Specialization',
    default: {},
  })
  specialization: Specialization;

  @Prop({ lowercase: true, trim: true })
  titleAbbreviation: string;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
