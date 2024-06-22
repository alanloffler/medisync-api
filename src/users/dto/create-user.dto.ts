import { IsEmail, IsNumberString, IsString, MaxLength, MinLength } from "class-validator";
import { USER_CONFIG } from "src/config/users.config";

export class CreateUserDto {
  @IsString({ message: USER_CONFIG.validation.firstName.message })
  @MinLength(3, { message: USER_CONFIG.validation.firstName.min })
  @MaxLength(30, { message: USER_CONFIG.validation.firstName.max })
  firstName: string;

  @IsString({ message: USER_CONFIG.validation.lastName.message })
  @MinLength(3, { message: USER_CONFIG.validation.lastName.min })
  @MaxLength(30, { message: USER_CONFIG.validation.lastName.max })
  lastName: string;

  @IsNumberString({ no_symbols: true }, { message: USER_CONFIG.validation.dni.message })
  @MinLength(7, { message: USER_CONFIG.validation.dni.min }) // 1 mill min
  @MaxLength(8, { message: USER_CONFIG.validation.dni.max }) // 99.99 mill max
  dni: string;

  @IsNumberString({ no_symbols: true }, { message: USER_CONFIG.validation.phone.message })
  @MinLength(10, { message: USER_CONFIG.validation.phone.min }) // 0000 000000
  @MaxLength(10, { message: USER_CONFIG.validation.phone.max }) // 0000 000000
  phone: string;
  
  @IsEmail({}, { message: USER_CONFIG.validation.email.message })
  email: string;
}
