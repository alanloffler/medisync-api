import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { IConfiguration } from '@professionals/interfaces/configuration.interface';
import { Specialization } from '@specializations/schema/specializations.schema';

export type ProfessionalDocument = HydratedDocument<Professional>;

@Schema({
  timestamps: true,
})
export class Professional {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    auto: true,
  })
  _id: string;

  @Prop({
    default: {},
    ref: 'Area',
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  area: string;

  @Prop({ required: true })
  areaCode: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({
    type: {
      scheduleTimeInit: { required: true, trim: true, type: String },
      scheduleTimeEnd: { required: true, trim: true, type: String },
      slotDuration: { required: true, type: Number },
      unavailableTimeSlot: {
        timeSlotUnavailableInit: { default: null, required: false, trim: true, type: String },
        timeSlotUnavailableEnd: { default: null, required: false, trim: true, type: String },
      },
      workingDays: { required: true, type: [{ day: Number, value: Boolean }] },
    },
  })
  configuration: IConfiguration;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true, unique: true })
  dni: number;

  @Prop({ lowercase: true, required: true, unique: true })
  email: string;

  @Prop({ lowercase: true, required: true, trim: true })
  firstName: string;

  @Prop({ lowercase: true, required: true, trim: true })
  lastName: string;

  @Prop({ required: true })
  phone: number;

  @Prop({
    default: {},
    ref: 'Specialization',
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  specialization: Specialization;

  @Prop({
    default: {},
    ref: 'Title',
    required: true,
    type: MongooseSchema.Types.ObjectId,
  })
  title: string;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
