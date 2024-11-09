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
}