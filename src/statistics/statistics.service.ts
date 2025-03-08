import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStats } from '@statistics/interfaces/statistics.interface';
import { Appointment } from '@appointments/schema/appointment.schema';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

  async countApposByProfessional(id: string): Promise<IResponse<IStats>> {
    const isValidId = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const total = await this.appointmentModel.countDocuments({ professional: id });
    const attended = await this.appointmentModel.countDocuments({ professional: id, status: 'attended' });
    const notAttended = await this.appointmentModel.countDocuments({ professional: id, status: 'not_attended' });
    if (!total || !attended || !notAttended) throw new HttpException('Error finding appointments statistics', HttpStatus.NOT_FOUND);

    return { data: { total, attended, notAttended }, message: 'Statistic count of appointments by professional', statusCode: 200 };
  }

  findOne(id: number) {
    return `This action returns a #${id} statistic`;
  }
}
