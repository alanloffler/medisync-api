import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    auto: true,
  })
  _id: string;

  @Prop({ lowercase: true, trim: true, required: true })
  firstName: string;

  @Prop({ lowercase: true, trim: true, required: true })
  lastName: string;

  @Prop({ unique: true, required: true })
  dni: number;

  @Prop({ required: true })
  areaCode: number;

  @Prop({ required: true })
  phone: number;

  @Prop({ lowercase: true, trim: true, unique: false, required: false })
  email?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
