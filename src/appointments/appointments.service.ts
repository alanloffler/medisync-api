import mongoose, { Model } from 'mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { z } from 'zod';
import type { IResponse } from '@common/interfaces/response.interface';
import { APPOINTMENTS_CONFIG } from '@config/appointments.config';
import { Appointment } from '@appointments/schema/appointment.schema';
import { CreateAppointmentDto } from '@appointments/dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(@InjectModel('Appointment') private appointmentModel: Model<Appointment>) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<IResponse> {
    const appointment = await this.appointmentModel.create(createAppointmentDto);
    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.created, data: appointment };
  }

  async findAll(page: string, limit: string): Promise<IResponse<Appointment[]>> {
    const _page: number = Number(page);
    const _limit: number = Number(limit);

    const schema = z.number().min(0).int();

    if (!schema.safeParse(_page).success) throw new HttpException(APPOINTMENTS_CONFIG.inlineValidation.page, HttpStatus.BAD_REQUEST);
    if (!schema.safeParse(_limit).success) throw new HttpException(APPOINTMENTS_CONFIG.inlineValidation.limit, HttpStatus.BAD_REQUEST);

    const appointments = await this.appointmentModel
      .find()
      .sort({ day: -1, hour: 1 })
      .skip(_page * _limit)
      .limit(_limit + 1)
      .populate({ path: 'user', select: '_id firstName lastName dni' })
      .populate({
        path: 'professional',
        select: '_id title specialization firstName lastName',
        populate: [
          { path: 'title', select: 'abbreviation' },
          { path: 'specialization', select: '_id name', strictPopulate: false },
        ],
      });

    if (!appointments) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);
    if (appointments.length === 0) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);

    const hasMore: boolean = appointments.length > _limit;
    const appointmentsResult = hasMore ? appointments.slice(0, -1) : appointments;

    const totalItems = await this.appointmentModel.countDocuments();
    if (!totalItems) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundPlural, data: appointmentsResult, pagination: { hasMore, totalItems } };
  }

  async findAllByProfessional(id: string, day: string): Promise<IResponse> {
    const appointments = await this.appointmentModel.find({ professional: id, day: day }).populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments || appointments.length === 0) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundPlural, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundPlural, data: appointments };
  }

  async findAllByUser(id: string): Promise<IResponse> {
    const appointments = await this.appointmentModel
      .find({ user: id })
      .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundPlural, data: [] };
    if (appointments.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.empty, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundPlural, data: appointments };
  }

  async findUniqueProfessionalsByUser(id: string): Promise<IResponse> {
    const professionals = await this.appointmentModel
      .aggregate([
        { $match: { user: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: '$professional' } },
        {
          $lookup: {
            from: 'professionals',
            localField: '_id',
            foreignField: '_id',
            as: 'professionalDetails',
          },
        },
        { $unwind: '$professionalDetails' },
        {
          $lookup: {
            from: 'titles',
            localField: 'professionalDetails.title',
            foreignField: '_id',
            as: 'titleDetails',
          },
        },
        { $unwind: '$titleDetails' },
        {
          $project: {
            _id: '$professionalDetails._id',
            firstName: '$professionalDetails.firstName',
            lastName: '$professionalDetails.lastName',
            title: {
              _id: '$titleDetails._id',
              abbreviation: '$titleDetails.abbreviation',
            },
          },
        },
      ])
      .exec();

    if (!professionals) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundUniqueProfessionals, data: [] };
    if (professionals.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.emptyUniqueProfessionals, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundUniqueProfessionals, data: professionals };
  }

  // WIP: this method is replacing findAllByUserAndProfessional and findAllByUserAndYear
  // Test it!
  async findApposRecordWithFilters(userId: string, professionalId?: string, year?: string) {
    let appointments: Appointment[] = [];
    let response: { statusCode: number; message: string } = { statusCode: 0, message: '' };

    if (professionalId === 'null' || professionalId === undefined || professionalId === null) {
      if (year === 'null' || year === undefined || year === null) {
        appointments = await this.appointmentModel
          .find({ user: userId })
          .sort({ day: -1 })
          .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
          .populate({ path: 'user', select: '_id firstName lastName dni' });
        response = { statusCode: 200, message: 'Appointments found by user' };
      } else {
        appointments = await this.appointmentModel
          .find({ user: userId, day: { $regex: year } })
          .sort({ day: -1 })
          .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
          .populate({ path: 'user', select: '_id firstName lastName dni' });
        response = { statusCode: 200, message: 'find by user and year' };
      }
    } else {
      if (year === 'null' || year === undefined || year === null) {
        appointments = await this.appointmentModel
          .find({ user: userId, professional: professionalId })
          .sort({ day: -1 })
          .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
          .populate({ path: 'user', select: '_id firstName lastName dni' });
        response = { statusCode: 200, message: 'find by professional' };
      } else {
        appointments = await this.appointmentModel
          .find({ user: userId, professional: professionalId, day: { $regex: year } })
          .sort({ day: -1 })
          .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
          .populate({ path: 'user', select: '_id firstName lastName dni' });
        response = { statusCode: 200, message: 'find by professional and year' };
      }
    }

    return { statusCode: response.statusCode, message: response.message, data: appointments };
  }

  async findAllByUserAndProfessional(userId: string, professionalId: string): Promise<IResponse> {
    const appointments = await this.appointmentModel
      .find({ user: userId, professional: professionalId })
      .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundPlural, data: [] };
    if (appointments.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.empty, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundPlural, data: appointments };
  }

  async findAllByUserAndYear(user: string, year: string, month: string | undefined): Promise<IResponse> {
    if (year === undefined) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundPlural, data: [] };

    let regex: RegExp;
    month === undefined ? (regex = new RegExp(year)) : (regex = new RegExp(`^${year}-${month}`));

    const appointments: Appointment[] = await this.appointmentModel
      .find({ user: user, day: { $regex: regex } })
      .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointments) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundPlural, data: [] };
    if (appointments.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.empty, data: [] };

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundPlural, data: appointments };
  }

  async findOne(id: string): Promise<IResponse> {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate({ path: 'professional', select: '_id firstName lastName', populate: { path: 'title', select: 'abbreviation' } })
      .populate({ path: 'user', select: '_id firstName lastName dni' });

    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundSingular, data: appointment };
  }

  async remove(id: string): Promise<IResponse> {
    const appointment = await this.appointmentModel.findByIdAndDelete(id);
    if (!appointment) throw new HttpException(APPOINTMENTS_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.removed, data: appointment };
  }
  // Used on UI select user appos by year
  async findApposYearsByUser(user: string): Promise<IResponse> {
    const years = await this.appointmentModel.find({ user: user }).distinct('day');

    if (!years) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundYears, data: [] };
    if (years.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.emptyYears, data: [] };

    const uniqueYears = [...new Set(years.map((year: string) => year.substring(0, 4)))];

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundYears, data: uniqueYears };
  }

  async findApposMonthsByUser(user: string, year: string): Promise<IResponse> {
    const apposByYear = await this.appointmentModel.find({ user: user, day: { $regex: year } });

    if (!apposByYear) return { statusCode: 404, message: APPOINTMENTS_CONFIG.response.error.notFoundMonths, data: [] };
    if (apposByYear.length === 0) return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.emptyMonths, data: [] };

    const uniqueMonths = [...new Set(apposByYear.map((appo) => appo.day.substring(5, 7)))];

    return { statusCode: 200, message: APPOINTMENTS_CONFIG.response.success.foundMonths, data: uniqueMonths };
  }
}
