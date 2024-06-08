import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Specialization } from '../../specializations/schema/specializations.schema';

export type AreaDocument = HydratedDocument<Area>;

@Schema()
export class Area {
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
    type: [
      {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Specialization',
      },
    ],
    default: [],
  })
  specializations: Specialization[];

  @Prop({
    required: true,
    default: 1,
  })
  active: number;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
