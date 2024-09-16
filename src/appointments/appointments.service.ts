import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APPOINTMENTS_CONFIG } from '@config/appointments.config';
import { Appointment } from '@appointments/schema/appointment.schema';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';
import { IResponse } from '@common/interfaces/response.interface';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel('Appointment') private appointmentModel: Model<Appointment>) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<IResponse> {
    const appointment = await this.appointmentModel.create(createAppointmentDto);
    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.created, data: appointment };
  }

  async findAll(): Promise<IResponse> {
    const appointments = await this.appointmentModel.find();
    if (!appointments) throw new HttpException(APPOINTMENTS_CONFIG.response.notFoundPlural, HttpStatus.NOT_FOUND);
    if (appointments.length === 0) throw new HttpException(APPOINTMENTS_CONFIG.response.notFoundPlural, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.foundPlural, data: appointments };
  }

  async findAllByProfessional(id: string, day: string): Promise<IResponse> {
    const appointments = await this.appointmentModel
      .find({ professional: id, day: day })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments || appointments.length === 0) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.notFoundPlural, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.foundPlural, data: appointments };
  }

  async findOne(id: string): Promise<IResponse> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.notFoundSingular, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.foundSingular, data: appointment };
  }

  async remove(id: string): Promise<IResponse> {
    const appointment = await this.appointmentModel.findByIdAndDelete(id);
    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.notRemoved, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.removed, data: appointment };
  }
}
