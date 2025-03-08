import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

  async countApposByProfessional(id: string): Promise<IResponse<number>> {
    const isValidId = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const appointments = await this.appointmentModel.countDocuments({ professional: id });
    if (!appointments) throw new HttpException('Appointments not found', HttpStatus.NOT_FOUND);

    return { data: appointments, message: 'Count of appointments by professional', statusCode: 200 };
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
