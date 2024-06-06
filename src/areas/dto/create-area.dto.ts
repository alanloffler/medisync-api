import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  plural: string;
  
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsIn([0, 1])
  active: number;
}
