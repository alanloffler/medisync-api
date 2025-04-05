import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IApposChart } from '@dashboard/interfaces/appos-chart.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { Professional } from '@professionals/schema/professional.schema';
import { User } from '@users/schema/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    @InjectModel('Professional') private readonly professionalModel: Model<Professional>,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async apposDaysCount(days: string): Promise<IResponse<IApposChart[]>> {
    const _days: number = parseInt(days) || 7;
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

    if (appointments.length === 0) return { data: [], message: this.i18nService.t('exception.dashboard.emptyDaysCount'), statusCode: HttpStatus.NOT_FOUND };
    if (appointments === undefined || appointments === null) throw new HttpException(this.i18nService.t('exception.dashboard.notFoundDaysCount'), HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: this.i18nService.t('response.dashboard.foundDaysCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countAppointments(): Promise<IResponse<number[]>> {
    const appointments = await this.appointmentModel.countDocuments();
    if (appointments === undefined || appointments === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorApposCount'), HttpStatus.BAD_REQUEST);

    return {
      data: [appointments],
      message: this.i18nService.t('response.dashboard.apposCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countAppointmentsLastMonth(): Promise<IResponse<number>> {
    const appointments = await this.appointmentModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (appointments === undefined || appointments === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorLatestApposCount'), HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: this.i18nService.t('response.dashboard.latestApposCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countProfessionals(): Promise<IResponse<number>> {
    const professionals = await this.professionalModel.countDocuments();
    if (professionals === undefined || professionals === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorProfessionalsCount'), HttpStatus.BAD_REQUEST);

    return {
      data: professionals,
      message: this.i18nService.t('response.dashboard.professionalsCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countProfessionalsLastMonth(): Promise<IResponse<number>> {
    const professionals = await this.professionalModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (professionals === undefined || professionals === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorLatestProfessionalsCount'), HttpStatus.BAD_REQUEST);

    return {
      data: professionals,
      message: this.i18nService.t('response.dashboard.latestProfessionalsCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countUsers(): Promise<IResponse<number>> {
    const users = await this.userModel.countDocuments();
    if (users === undefined || users === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorUsersCount'), HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: this.i18nService.t('response.dashboard.usersCount'),
      statusCode: HttpStatus.OK,
    };
  }

  async countUsersLastMonth(): Promise<IResponse<number>> {
    const users = await this.userModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });

    if (users === undefined || users === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorLatestUsersCount'), HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: this.i18nService.t('response.dashboard.latestUsersCount'),
      statusCode: HttpStatus.OK,
    };
  }

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

    if (appointments.length === 0) throw new HttpException(this.i18nService.t('exception.dashboard.emptyLatestAppos'), HttpStatus.NOT_FOUND);
    if (appointments === undefined || appointments === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorLatestAppos'), HttpStatus.BAD_REQUEST);

    return {
      data: appointments,
      message: this.i18nService.t('response.dashboard.latestAppos'),
      statusCode: HttpStatus.OK,
    };
  }

  async latestUsers(limit: string): Promise<IResponse<User[]>> {
    const users = await this.userModel.find().sort({ createdAt: -1 }).limit(parseInt(limit));

    if (users.length === 0) throw new HttpException(this.i18nService.t('exception.dashboard.emptyLatestUsers'), HttpStatus.NOT_FOUND);
    if (users === undefined || users === null) throw new HttpException(this.i18nService.t('exception.dashboard.errorLatestUsers'), HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: this.i18nService.t('response.dashboard.latestUsers'),
      statusCode: HttpStatus.OK,
    };
  }
}
