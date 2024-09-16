import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}
