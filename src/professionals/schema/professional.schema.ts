import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Specialization } from '../../specializations/schema/specializations.schema';

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
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
