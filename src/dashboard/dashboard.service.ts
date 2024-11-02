import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';

@Injectable()
export class DashboardService {
  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

  async countAppointments(): Promise<IResponse> {
    const appointments = await this.appointmentModel.countDocuments();
    if (!appointments) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: 'Appointments found', data: appointments };
  }
}
