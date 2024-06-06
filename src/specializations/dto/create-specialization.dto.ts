import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSpecializationDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  plural: string;
  
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @IsString()
  @IsNotEmpty()
  area: string;
  
  @IsNumber()
  @IsIn([0, 1])
  active: number;
}
