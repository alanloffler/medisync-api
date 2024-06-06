import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SpecializationDocument = HydratedDocument<Specialization>;

@Schema()
export class Specialization {
  @Prop({
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  plural: string;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId, 
    ref: 'Area'
  })
  area: Types.ObjectId;

  @Prop({
    required: true,
    default: 1,
  })
  active: number;
}

export const SpecializationSchema = SchemaFactory.createForClass(Specialization);
