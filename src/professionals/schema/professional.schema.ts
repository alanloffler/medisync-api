import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfessionalDocument = HydratedDocument<Professional>;

@Schema()
export class Professional {
  @Prop()
  available: boolean;

  @Prop()
  area: string;

  @Prop()
  specialization: string;

  @Prop()
  titleAbbreviation: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone: number;
}

export const ProfessionalSchema = SchemaFactory.createForClass(Professional);
