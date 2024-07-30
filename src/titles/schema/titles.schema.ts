import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TitleDocument = HydratedDocument<Title>;

@Schema({ timestamps: true })
export class Title {
  @Prop()
  name: string;

  @Prop()
  abbreviation: string;
}

export const TitleSchema = SchemaFactory.createForClass(Title);
