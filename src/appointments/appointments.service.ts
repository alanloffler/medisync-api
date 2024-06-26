import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from './schema/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
// import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { IResponse } from 'src/common/interfaces/response.interface';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel('Appointment') private appointmentModel: Model<Appointment>) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<IResponse> {
    const appointment = await this.appointmentModel.create(createAppointmentDto);
    if (!appointment) throw new HttpException('Appointment not created', HttpStatus.BAD_REQUEST);
    
    return { statusCode: 200, message: 'Appointment created', data: appointment };
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.appointmentModel.find();
    if (!appointments) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);
    if (appointments.length === 0) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);

    return appointments;
  }

  async findAllByProfessional(id: string, day: string): Promise<Appointment[]> {
    // console.log(day, id)
    const appointments = await this.appointmentModel
    .find({ professional: id, day: day })
    .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);
    if (appointments.length === 0) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);
    // console.log(appointments);
    return appointments;
  }
  
  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate({ path: 'professional', select: '_id firstName lastName titleAbbreviation' })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointment) throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);

    return appointment;
  }
  
  // update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
  //   return `This action updates a #${id} appointment`;
  // }

  async remove(id: string): Promise<IResponse> {
    const appointment = await this.appointmentModel.findByIdAndDelete(id);
    if (!appointment) throw new HttpException('Appointment not deleted', HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: 'Appointment deleted', data: appointment };
  }
}
