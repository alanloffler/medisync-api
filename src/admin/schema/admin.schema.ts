import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    auto: true,
  })
  _id: string;

  @Prop({ lowercase: true, trim: true, required: true })
  firstName: string;

  @Prop({ lowercase: true, trim: true, required: true })
  lastName: string;

  @Prop({ lowercase: true, trim: true, unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
