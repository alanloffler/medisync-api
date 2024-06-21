import { IsEmail, IsInt, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsInt({ message: 'DNI must be a number' })
  @MinLength(7, { message: 'DNI must have at least 7 digits' })
  @MaxLength(8, { message: 'DNI must have at most 8 digits' })
  dni: number;

  @IsInt({ message: 'Phone must be a number' })
  phone: number;
  
  @IsEmail()
  email: string;
}
