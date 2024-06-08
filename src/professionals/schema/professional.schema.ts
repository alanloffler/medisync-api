import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Specialization } from 'src/specializations/schema/specializations.schema';

export type ProfessionalDocument = HydratedDocument<Professional>;

@Schema()
export class Professional {
  @Prop()
  available: number;

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
