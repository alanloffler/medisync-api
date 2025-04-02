import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { parse } from '@formkit/tempo';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IAvailability } from '@professionals/interfaces/availability.interface';
import type { IDBCount } from '@professionals/interfaces/db-count.interface';
import type { IProfessionalsData } from '@professionals/interfaces/professionals-data.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';
import { Professional } from '@professionals/schema/professional.schema';
import { UpdateProfessionalDto } from '@professionals/dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    @InjectModel(Professional.name) private readonly professionalModel: Model<Professional>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createProfessionalDto: CreateProfessionalDto): Promise<IResponse<Professional>> {
    const professionalExists: Professional = await this.professionalModel.findOne({ dni: createProfessionalDto.dni });
    if (professionalExists) throw new HttpException(this.i18nService.t('exception.professionals.alreadyExists'), HttpStatus.CONFLICT);

    const professional: Professional = await this.professionalModel.create(createProfessionalDto);
    if (!professional) throw new HttpException(this.i18nService.t('exception.professionals.failedCreate'), HttpStatus.BAD_REQUEST);

    return {
      data: professional,
      message: this.i18nService.t('response.professionals.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findBySpecialization(id: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<IProfessionalsData>> {
    if (sortingKey === 'area' || sortingKey === 'specialization') sortingKey = sortingKey + '.name';
    let obj = {};
    if (sortingValue === 'asc') obj = { [sortingKey]: 1 };
    if (sortingValue === 'desc') obj = { [sortingKey]: -1 };

    const professionals: Professional[] = await this.professionalModel
      .find({ specialization: id })
      .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .populate({ path: 'title', select: '_id name abbreviation', strictPopulate: false })
      .sort(obj)
      .limit(Number(limit))
      .skip(Number(skip));

    if (professionals.length === 0) throw new HttpException(this.i18nService.t('exception.professionals.emptyPlural'), HttpStatus.NOT_FOUND);
    if (professionals === undefined || professionals === null) throw new HttpException(this.i18nService.t('exception.professionals.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const count: number = await this.professionalModel.find({ specialization: id }).countDocuments();

    const pageTotal: number = Math.floor((count - 1) / parseInt(limit)) + 1;

    return {
      data: { count: count, data: professionals, total: pageTotal },
      message: this.i18nService.t('response.professionals.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<IProfessionalsData>> {
    if (sortingKey === 'area' || sortingKey === 'specialization') sortingKey = sortingKey + '.name';
    let obj = {};
    if (sortingValue === 'asc') obj = { [sortingKey]: 1 };
    if (sortingValue === 'desc') obj = { [sortingKey]: -1 };

    const professionals = await this.professionalModel
      .aggregate([
        {
          $lookup: {
            from: 'specializations',
            localField: 'specialization',
            foreignField: '_id',
            as: 'specialization',
          },
        },
        { $unwind: '$specialization' },
        {
          $lookup: {
            from: 'areas',
            localField: 'area',
            foreignField: '_id',
            as: 'area',
          },
        },
        { $unwind: '$area' },
        {
          $lookup: {
            from: 'titles',
            localField: 'title',
            foreignField: '_id',
            as: 'title',
          },
        },
        { $unwind: '$title' },
        {
          $match: {
            $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { 'specialization.name': { $regex: search, $options: 'i' } }],
          },
        },
        { $sort: obj },
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        {
          $project: {
            _id: 1,
            available: 1,
            area: { _id: 1, name: 1 },
            dni: 1,
            specialization: { _id: 1, name: 1 },
            title: { _id: 1, name: 1, abbreviation: 1 },
            firstName: 1,
            lastName: 1,
            email: 1,
            areaCode: 1,
            phone: 1,
            __v: 1,
          },
        },
      ])
      .exec();

    const count = await this.professionalModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
      })
      .countDocuments();

    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;

    if (professionals.length === 0) throw new HttpException(this.i18nService.t('exception.professionals.emptyPlural'), HttpStatus.NOT_FOUND);
    if (professionals === undefined || professionals === null) throw new HttpException(this.i18nService.t('exception.professionals.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: { count: count, data: professionals, total: pageTotal },
      message: this.i18nService.t('response.professionals.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAllActive(): Promise<IResponse<Professional[]>> {
    const professionals = await this.professionalModel
      .find({ available: true })
      .sort({ lastName: 'asc' })
      .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .populate({ path: 'title', select: '_id name abbreviation', strictPopulate: false })
      .exec();

    if (professionals.length === 0) throw new HttpException(this.i18nService.t('exception.professionals.emptyPlural'), HttpStatus.NOT_FOUND);
    if (!professionals) throw new HttpException(this.i18nService.t('exception.professionals.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: professionals,
      message: this.i18nService.t('response.professionals.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAllAvailableForChange(day: string, hour: string): Promise<IResponse<Professional[]>> {
    const dayRegex: RegExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const hourRegex: RegExp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!dayRegex.test(day)) throw new HttpException(this.i18nService.t('exception.professionals.invalidDay'), HttpStatus.BAD_REQUEST);
    if (!hourRegex.test(hour)) throw new HttpException(this.i18nService.t('exception.professionals.invalidHour'), HttpStatus.BAD_REQUEST);

    const dayOfWeek: number = parse(day, 'YYYY-MM-DD').getDay();

    const professionalsOnWorkingDays: Professional[] = await this.professionalModel
      .find({
        'configuration.workingDays': {
          $elemMatch: {
            day: dayOfWeek,
            value: true,
          },
        },
        available: true,
      })
      .populate({ path: 'title', select: '_id abbreviation', strictPopulate: false })
      .sort({ lastName: 'asc' })
      .exec();

    if (professionalsOnWorkingDays.length === 0) throw new HttpException(this.i18nService.t('exception.professionals.emptyPlural'), HttpStatus.NOT_FOUND);
    if (!professionalsOnWorkingDays) throw new HttpException(this.i18nService.t('exception.professionals.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const appointmentsInSlot: Appointment[] = await this.appointmentModel.find({ day: day, hour: hour }).exec();
    if (appointmentsInSlot.length === 0) throw new HttpException(this.i18nService.t('exception.appointments.emptyDatabase'), HttpStatus.NOT_FOUND);
    if (appointmentsInSlot === undefined || appointmentsInSlot === null) throw new HttpException(this.i18nService.t('exception.appointments.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const appointmentProfessionalIds: string[] = appointmentsInSlot.map((appointment) => appointment.professional.toString());
    const filteredProfessionals: Professional[] = professionalsOnWorkingDays.filter((professional) => !appointmentProfessionalIds.includes(professional._id.toString()));

    return {
      data: filteredProfessionals,
      message: this.i18nService.t('response.professionals.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Professional>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const professional = await this.professionalModel
      .findById(id)
      .populate({ path: 'specialization', select: '_id name description icon', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .populate({ path: 'title', select: '_id name abbreviation', strictPopulate: false })
      .exec();

    if (!professional) throw new HttpException(this.i18nService.t('exception.professionals.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: professional,
      message: this.i18nService.t('response.professionals.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse<Professional>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const update = await this.professionalModel.findByIdAndUpdate(id, updateProfessionalDto, { new: true });
    if (!update) throw new HttpException(this.i18nService.t('exception.professionals.failedUpdate'), HttpStatus.BAD_REQUEST);

    return {
      data: update,
      message: this.i18nService.t('response.professionals.updated'),
      statusCode: HttpStatus.OK,
    };
  }

  async updateAvailability(id: string, availability: boolean): Promise<IResponse<IAvailability>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const update = await this.professionalModel.findByIdAndUpdate(id, { available: availability }, { new: true });
    if (!update) throw new HttpException(this.i18nService.t('exception.professionals.notUpdateAvailability'), HttpStatus.BAD_REQUEST);

    return {
      data: { id: update._id, available: update.available },
      message: this.i18nService.t('response.professionals.updateAvailability'),
      statusCode: HttpStatus.OK,
    };
  }

  // TODO: remove appointments associated to the professional
  async remove(id: string): Promise<IResponse<Professional>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const remove: Professional = await this.professionalModel.findByIdAndDelete(id);
    if (!remove) throw new HttpException(this.i18nService.t('exception.professionals.failedRemove'), HttpStatus.BAD_REQUEST);

    return {
      data: remove,
      message: this.i18nService.t('response.professionals.removed'),
      statusCode: HttpStatus.OK,
    };
  }

  async databaseCount(): Promise<IResponse<IDBCount>> {
    const count: number = await this.professionalModel.countDocuments();
    const countAvailable: number = await this.professionalModel.countDocuments({ available: true });
    const countNotAvailable: number = await this.professionalModel.countDocuments({ available: false });

    if (!count || !countAvailable || !countNotAvailable) throw new HttpException(this.i18nService.t('exception.professionals.notDatabaseCount'), HttpStatus.BAD_REQUEST);

    return {
      data: { total: count, available: countAvailable, notAvailable: countNotAvailable },
      message: this.i18nService.t('response.professionals.databaseCount'),
      statusCode: HttpStatus.OK,
    };
  }
}
