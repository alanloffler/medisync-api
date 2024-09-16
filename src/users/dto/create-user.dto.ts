import { IsEmail, IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { USERS_CONFIG } from "@config/users.config";

export class CreateUserDto {
  @IsString({ message: USERS_CONFIG.validation.isString.firstName })
  @MinLength(3, { message: USERS_CONFIG.validation.min.firstName })
  @MaxLength(30, { message: USERS_CONFIG.validation.max.firstName })
  firstName: string;

  @IsString({ message: USERS_CONFIG.validation.isString.lastName })
  @MinLength(3, { message: USERS_CONFIG.validation.min.lastName })
  @MaxLength(30, { message: USERS_CONFIG.validation.max.lastName })
  lastName: string;

  @IsInt({ message: USERS_CONFIG.validation.isInt.dni })
  @Min(1000000, { message: USERS_CONFIG.validation.min.dni }) // 1 mill min
  @Max(99999999, { message: USERS_CONFIG.validation.max.dni }) // 99.99 mill max
  dni: number;

  @IsInt({ message: USERS_CONFIG.validation.isInt.phone })
  @Min(1000000000, { message: USERS_CONFIG.validation.min.phone }) // 0000 000000
  @Max(9999999999, { message: USERS_CONFIG.validation.max.phone }) // 0000 000000
  phone: number;
  
  @IsEmail({}, { message: USERS_CONFIG.validation.isEmail.email })
  email: string;
}
