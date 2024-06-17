import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Specialization } from '../../specializations/schema/specializations.schema';
import { IConfiguration } from '../interfaces/configuration.interface';

export type ProfessionalDocument = HydratedDocument<Professional>;

@Schema({
  timestamps: true,
})
export class Professional {
  @Prop({ default: true })
  available: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Area',
    default: {},
  })
  area: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Specialization',
    default: {},
  })
  specialization: Specialization;

  @Prop({ lowercase: true, trim: true })
  titleAbbreviation: string;

  @Prop({ lowercase: true, trim: true })
  firstName: string;

  @Prop({ lowercase: true, trim: true })
  lastName: string;

  @Prop({ unique: true, lowercase: true })
  email: string;

  @Prop()
  phone: number;

  @Prop({
    type: {
      scheduleTimeInit: { type: String, default: '08:00:00', trim: true },
      scheduleTimeEnd: { type: String, default: '18:00:00', trim: true },
      timeSlotUnavailableInit: { type: String, default: '12:00:00', trim: true },
      timeSlotUnavailableEnd: { type: String, default: '14:00:00', trim: true },
    },
    default: {
      scheduleTimeInit: '08:00:00',
      scheduleTimeEnd: '18:00:00',
      timeSlotUnavailableInit: '12:00:00',
      timeSlotUnavailableEnd: '14:00:00',
    },
  })
  configuration: IConfiguration;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
