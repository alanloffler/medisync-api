import { IsNotEmpty, IsString } from "class-validator";

export class CreateTitleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  abbreviation: string;
}
