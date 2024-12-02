import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { Professional } from '@/professionals/schema/professional.schema';
import { User } from '@users/schema/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    @InjectModel('Professional') private readonly professionalModel: Model<Professional>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async countAppointments(): Promise<IResponse> {
    const appointments = await this.appointmentModel.countDocuments();
    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.count, data: [appointments] };
  }

  async countAppointmentsLastMonth(): Promise<IResponse> {
    const appointments = await this.appointmentModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundLatest, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.count, data: appointments };
  }

  async countUsers(): Promise<IResponse> {
    const users = await this.userModel.countDocuments();
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.count, data: users };
  }

  async countUsersLastMonth(): Promise<IResponse> {
    const users = await this.userModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (users === 0) return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.foundLatest, data: 0 };
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.foundLatest, data: users };
  }

  async countProfessionals(): Promise<IResponse> {
    const professionals = await this.professionalModel.countDocuments();
    if (!professionals) throw new HttpException(DASHBOARD_CONFIG.response.error.professional.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.professional.count, data: professionals };
  }

  async countProfessionalsLastMonth(): Promise<IResponse> {
    const professionals = await this.professionalModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (professionals === 0) return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.professional.foundLatest, data: 0 };
    if (!professionals) throw new HttpException(DASHBOARD_CONFIG.response.error.professional.notFoundLatest, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.professional.foundLatest, data: professionals };
  }

  async latestAppointments(limit: string): Promise<IResponse> {
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

    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundLatest, HttpStatus.NOT_FOUND);
    if (appointments.length === 0) return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.foundLatest, data: [] };

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.foundLatest, data: appointments };
  }

  async latestUsers(limit: string): Promise<IResponse> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).limit(parseInt(limit));
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.foundLatest, data: users };
  }

  async apposDaysCount(days: string): Promise<IResponse> {
    if (!days) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.daysNotFound, HttpStatus.NOT_FOUND);

    const _days: number = parseInt(days);
    const daysAgo: Date = new Date();
    daysAgo.setDate(daysAgo.getDate() - (_days - 1));

    const appointments = await this.appointmentModel.aggregate([
      {
        $match: {
          day: {
            $gte: daysAgo.toISOString().split('T')[0],
            $lte: new Date().toISOString().split('T')[0],
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

    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.notFoundDaysCount, HttpStatus.BAD_REQUEST);
    if (appointments.length === 0) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.emptyDaysCount, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.foundDaysCount, data: appointments };
  }
}
