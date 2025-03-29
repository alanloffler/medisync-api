import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IApposChart } from '@dashboard/interfaces/appos-chart.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { Professional } from '@professionals/schema/professional.schema';
import { User } from '@users/schema/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    @InjectModel('Professional') private readonly professionalModel: Model<Professional>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  // * CHECKED: used on Frontend
  async apposDaysCount(days: string): Promise<IResponse<IApposChart[]>> {
    if (!days) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.daysNotFound, HttpStatus.BAD_REQUEST);

    const _days: number = parseInt(days);
    const daysAgo: Date = new Date();
    let includedDaysCount: number = 0;
    const validDates: string[] = [];

    while (includedDaysCount < _days) {
      if (daysAgo.getDay() !== 0) {
        validDates.push(daysAgo.toISOString().split('T')[0]);
        includedDaysCount++;
      }
      daysAgo.setDate(daysAgo.getDate() - 1);
    }

    const appointments: IApposChart[] = await this.appointmentModel.aggregate([
      {
        $match: {
          day: {
            $gte: validDates[validDates.length - 1],
            $lte: validDates[0],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $dateFromString: { dateString: '$day', format: '%Y-%m-%d' } },
            },
          },
          value: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: '$_id',
          value: 1,
          _id: 0,
        },
      },
    ]);

    if (appointments.length === 0) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.emptyDaysCount, HttpStatus.NOT_FOUND);
    if (appointments === undefined || appointments === null) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundDaysCount, HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: DASHBOARD_CONFIG.response.success.appointment.foundDaysCount,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countAppointments(): Promise<IResponse<number[]>> {
    const appointments = await this.appointmentModel.countDocuments();
    if (appointments === undefined || appointments === null) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.count, HttpStatus.BAD_REQUEST);

    return {
      data: [appointments],
      message: DASHBOARD_CONFIG.response.success.appointment.count,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countAppointmentsLastMonth(): Promise<IResponse<number>> {
    const appointments = await this.appointmentModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (appointments === undefined || appointments === null) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundLatest, HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: DASHBOARD_CONFIG.response.success.appointment.count,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countProfessionals(): Promise<IResponse<number>> {
    const professionals = await this.professionalModel.countDocuments();
    if (professionals === undefined || professionals === null) throw new HttpException(DASHBOARD_CONFIG.response.error.professional.count, HttpStatus.BAD_REQUEST);

    return {
      data: professionals,
      message: DASHBOARD_CONFIG.response.success.professional.count,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countProfessionalsLastMonth(): Promise<IResponse<number>> {
    const professionals = await this.professionalModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (professionals === undefined || professionals === null) throw new HttpException(DASHBOARD_CONFIG.response.error.professional.notFoundLatest, HttpStatus.BAD_REQUEST);

    return {
      data: professionals,
      message: DASHBOARD_CONFIG.response.success.professional.foundLatest,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countUsers(): Promise<IResponse<number>> {
    const users = await this.userModel.countDocuments();
    if (users === undefined || users === null) throw new HttpException(DASHBOARD_CONFIG.response.error.user.count, HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: DASHBOARD_CONFIG.response.success.user.count,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async countUsersLastMonth(): Promise<IResponse<number>> {
    const users = await this.userModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (users === undefined || users === null) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: DASHBOARD_CONFIG.response.success.user.foundLatest,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async latestAppointments(limit: string): Promise<IResponse<Appointment[]>> {
    const appointments = await this.appointmentModel
      .find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate({ path: 'user', select: 'firstName lastName dni' })
      .populate({
        path: 'professional',
        select: 'title specialization firstName lastName',
        populate: [
          { path: 'title', select: 'abbreviation' },
          { path: 'specialization', select: 'icon name' },
        ],
      });

    if (appointments.length === 0) throw new HttpException(DASHBOARD_CONFIG.response.success.appointment.foundLatest, HttpStatus.NOT_FOUND);
    if (appointments === undefined || appointments === null) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundLatest, HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: DASHBOARD_CONFIG.response.success.appointment.foundLatest,
      statusCode: HttpStatus.OK,
    };
  }

  // * CHECKED: used on Frontend
  async latestUsers(limit: string): Promise<IResponse<User[]>> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).limit(parseInt(limit));

    if (users.length === 0) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.NOT_FOUND);
    if (users === undefined || users === null) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: DASHBOARD_CONFIG.response.success.user.foundLatest,
      statusCode: HttpStatus.OK,
    };
  }
}
