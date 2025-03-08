import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

  async countApposByProfessional(): Promise<IResponse<number>> {
    const appointments = await this.appointmentModel.countDocuments();
    console.log(appointments);
    return { data: appointments, message: 'Count of appointments by professional', statusCode: 200 };
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
