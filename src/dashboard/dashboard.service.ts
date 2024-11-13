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

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.foundLatest, data: appointments };
  }

  async latestUsers(limit: string): Promise<IResponse> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).limit(parseInt(limit));
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.notFoundLatest, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.foundLatest, data: users };
  }

  async apposChartData(): Promise<IResponse> {
    // Last month (30 days)
    // const today: Date = new Date();
    // const last30Days: Date = new Date();

    // last30Days.setDate(today.getDate() - 30);

    // const appointments = await this.appointmentModel.aggregate([
    //   {
    //     $match: {
    //       $expr: {
    //         $gte: [{ $dateFromString: { dateString: '$day' } }, last30Days],
    //       },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         $dateToString: {
    //           format: '%Y-%m-%d',
    //           date: { $dateFromString: { dateString: '$day' } },
    //         },
    //       },
    //       value: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { _id: 1 },
    //   },
    //   {
    //     $project: {
    //       date: '$_id',
    //       value: 1,
    //       _id: 0,
    //     },
    //   },
    // ]);

    // Last week (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const appointments = await this.appointmentModel.aggregate([
      {
        $match: {
          $expr: {
            $gte: [{ $dateFromString: { dateString: '$day' } }, sevenDaysAgo],
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $dateFromString: { dateString: '$day' } },
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

    if (!appointments) throw new HttpException('Appos not found', HttpStatus.BAD_REQUEST);

    return { statusCode: HttpStatus.OK, message: 'Appos found', data: appointments };
  }
}
