import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { format } from '@formkit/tempo';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IStats } from '@statistics/interfaces/statistics.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { EStatus } from '@common/enums/status.enum';

@Injectable()
export class StatisticsService {
  constructor(@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>) {}

  async countTodayApposByProfessional(id: string): Promise<IResponse<IStats>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const today: string = format(new Date(), 'YYYY-MM-DD');
    const total: number = await this.appointmentModel.countDocuments({ professional: id, day: today });
    if (!total) throw new HttpException('Error finding today statistics of appointments by professional', HttpStatus.NOT_FOUND);

    return { data: { total }, message: 'Today statistics of appointments by professional', statusCode: 200 };
  }

  async countApposByProfessional(id: string): Promise<IResponse<IStats>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);

    const total: number = await this.appointmentModel.countDocuments({ professional: id });
    const attended: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.ATTENDED });
    const notAttended: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.NOT_ATTENDED });
    const notStatus: number = await this.appointmentModel.countDocuments({ professional: id, status: EStatus.NOT_STATUS });

    const currentDate: Date = new Date();
    const currentDateString: string = currentDate.toISOString().split('T')[0];
    const currentHour: string = currentDate.getHours().toString();
    const waiting: number = await this.appointmentModel.countDocuments({
      professional: id,
      status: EStatus.NOT_STATUS,
      $or: [{ day: { $gt: currentDateString } }, { day: currentDateString, hour: { $gt: currentHour } }],
    });

    if (!total) throw new HttpException('Error finding historical statistics of appointments by professional', HttpStatus.NOT_FOUND);

    const data: IStats = {
      total,
      attended,
      notAttended,
      notStatus: notStatus - waiting,
      waiting,
    };
    return { data, message: 'Historical statistics of appointments by professional', statusCode: 200 };
  }
}
