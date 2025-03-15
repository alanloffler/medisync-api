import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ERole } from '@common/enums/role.enum';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    auto: true,
  })
  _id: string;

  @Prop({ lowercase: true, required: true, trim: true })
  firstName: string;

  @Prop({ lowercase: true, required: true, trim: true })
  lastName: string;

  @Prop({ lowercase: true, required: true, trim: true, unique: true })
  email: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ enum: ERole, required: true, type: String })
  role: ERole;

  @Prop({ type: String })
  refreshToken: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
