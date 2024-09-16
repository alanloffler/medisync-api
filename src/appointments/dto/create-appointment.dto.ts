import { APPOINTMENTS_CONFIG } from '@config/appointments.config';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString({ message: APPOINTMENTS_CONFIG.validation.isString.professional })
  @IsNotEmpty({ message: APPOINTMENTS_CONFIG.validation.isNotEmpty.professional })
  professional: string;

  @IsString({ message: APPOINTMENTS_CONFIG.validation.isString.user })
  @IsNotEmpty({ message: APPOINTMENTS_CONFIG.validation.isNotEmpty.user })
  user: string;

  @IsString({ message: APPOINTMENTS_CONFIG.validation.isString.day })
  @IsNotEmpty({ message: APPOINTMENTS_CONFIG.validation.isNotEmpty.day })
  day: string;

  @IsString({ message: APPOINTMENTS_CONFIG.validation.isString.hour })
  @IsNotEmpty({ message: APPOINTMENTS_CONFIG.validation.isNotEmpty.hour })
  hour: string;

  @IsInt({ message: APPOINTMENTS_CONFIG.validation.isInt.slot })
  slot: number;
}
