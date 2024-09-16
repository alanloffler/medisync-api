import { IsEmail, IsInt, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { USERS_CONFIG } from "@config/users.config";

export class CreateUserDto {
  @IsString({ message: USERS_CONFIG.validation.firstName.message })
  @MinLength(3, { message: USERS_CONFIG.validation.firstName.min })
  @MaxLength(30, { message: USERS_CONFIG.validation.firstName.max })
  firstName: string;

  @IsString({ message: USERS_CONFIG.validation.lastName.message })
  @MinLength(3, { message: USERS_CONFIG.validation.lastName.min })
  @MaxLength(30, { message: USERS_CONFIG.validation.lastName.max })
  lastName: string;

  @IsInt({ message: USERS_CONFIG.validation.dni.message })
  @Min(1000000, { message: USERS_CONFIG.validation.dni.min }) // 1 mill min
  @Max(99999999, { message: USERS_CONFIG.validation.dni.max }) // 99.99 mill max
  dni: number;

  @IsInt({ message: USERS_CONFIG.validation.phone.message })
  @Min(1000000000, { message: USERS_CONFIG.validation.phone.min }) // 0000 000000
  @Max(9999999999, { message: USERS_CONFIG.validation.phone.max }) // 0000 000000
  phone: number;
  
  @IsEmail({}, { message: USERS_CONFIG.validation.email.message })
  email: string;
}
