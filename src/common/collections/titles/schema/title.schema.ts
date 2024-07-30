import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Title {
  @Prop()
  name: string;

  @Prop()
  abbreviation: string;
}
