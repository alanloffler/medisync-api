import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { DASHBOARD_CONFIG } from '@config/dashboard.config';
import { User } from '@users/schema/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async countAppointments(): Promise<IResponse> {
    const appointments = await this.appointmentModel.countDocuments();
    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.count, data: appointments };
  }

  async countAppointmentsLastMonth(): Promise<IResponse> {
    const appointments = await this.appointmentModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (!appointments) throw new HttpException(DASHBOARD_CONFIG.response.error.appointment.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.appointment.count, data: appointments };
  }

  async countUsers(): Promise<IResponse> {
    const users = await this.userModel.countDocuments();
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.count, data: users };
  }

  async countUsersLastMonth(): Promise<IResponse> {
    const users = await this.userModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (!users) throw new HttpException(DASHBOARD_CONFIG.response.error.user.count, HttpStatus.NOT_FOUND);

    return { statusCode: HttpStatus.OK, message: DASHBOARD_CONFIG.response.success.user.count, data: users };
  }
}
