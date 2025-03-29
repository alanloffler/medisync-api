import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { parse } from '@formkit/tempo';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IDBCount } from '@professionals/interfaces/db-count.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Appointment } from '@appointments/schema/appointment.schema';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';
import { PROFESSIONALS_CONFIG as PROF_CONFIG } from '@config/professionals.config';
import { Professional } from '@professionals/schema/professional.schema';
import { UpdateProfessionalDto } from '@professionals/dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(
    @InjectModel(Professional.name) private readonly professionalModel: Model<Professional>,
    @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  // CHECKED:
  // Used on service ProfessionalApiService.create()
  // Used on component CreateProfessional.tsx
  async create(createProfessionalDto: CreateProfessionalDto): Promise<IResponse<Professional>> {
    const professionalExists: Professional = await this.professionalModel.findOne({ dni: createProfessionalDto.dni });
    if (professionalExists) throw new HttpException(PROF_CONFIG.response.error.duplicatedKey, HttpStatus.BAD_REQUEST);

    const professional: Professional = await this.professionalModel.create(createProfessionalDto);
    if (!professional) throw new HttpException(PROF_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.created, data: professional };
  }

  // CHECKED:
  // Used on service ProfessionalApiService.searchProfessionalsBy()
  // Used on component ProfessionalsDataTable.tsx
  // TODO: create interface for data
  async findBySpecialization(id: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<any>> {
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

    if (!professionals || professionals.length === 0) throw new HttpException(PROF_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);

    const count: number = await this.professionalModel.find({ specialization: id }).countDocuments();

    const pageTotal: number = Math.floor((count - 1) / parseInt(limit)) + 1;

    return { statusCode: 200, message: PROF_CONFIG.response.success.foundPlural, data: { total: pageTotal, count: count, data: professionals } };
  }

  // CHECKED: used on Professionals.tsx
  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
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

    if (professionals.length === 0) throw new HttpException(PROF_CONFIG.response.success.searchNotFound, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: PROF_CONFIG.response.success.foundPlural, data: { total: pageTotal, count: count, data: professionals } };
  }

  async findAllActive(): Promise<IResponse<Professional[]>> {
    const professionals = await this.professionalModel
      .find({ available: true })
      .sort({ lastName: 'asc' })
      .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .populate({ path: 'title', select: '_id name abbreviation', strictPopulate: false })
      .exec();

    if (professionals.length === 0) throw new HttpException(PROF_CONFIG.response.success.empty, HttpStatus.NOT_FOUND);
    if (!professionals) throw new HttpException(PROF_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: PROF_CONFIG.response.success.foundPlural, data: professionals };
  }

  // CHECKED:
  // Used on service ProfessionalApiService.findAllAvailableForChange()
  // Used on component ProfessionalsSelect.tsx
  async findAllAvailableForChange(day: string, hour: string): Promise<IResponse<Professional[]>> {
    const dayRegex: RegExp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const hourRegex: RegExp = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!dayRegex.test(day)) throw new HttpException(PROF_CONFIG.validation.arguments.day, HttpStatus.BAD_REQUEST);
    if (!hourRegex.test(hour)) throw new HttpException(PROF_CONFIG.validation.arguments.hour, HttpStatus.BAD_REQUEST);

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

    if (professionalsOnWorkingDays.length === 0) throw new HttpException(PROF_CONFIG.response.success.empty, HttpStatus.NOT_FOUND);
    if (!professionalsOnWorkingDays) throw new HttpException(PROF_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    const appointmentsInSlot: Appointment[] = await this.appointmentModel.find({ day: day, hour: hour }).exec();
    if (appointmentsInSlot.length === 0) throw new HttpException(this.i18nService.t('exception.appointments.emptyDatabase'), HttpStatus.NOT_FOUND);
    if (appointmentsInSlot === undefined || appointmentsInSlot === null) throw new HttpException(this.i18nService.t('exception.appointments.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const appointmentProfessionalIds: string[] = appointmentsInSlot.map((appointment) => appointment.professional.toString());
    const filteredProfessionals: Professional[] = professionalsOnWorkingDays.filter((professional) => !appointmentProfessionalIds.includes(professional._id.toString()));

    return { statusCode: 200, message: PROF_CONFIG.response.success.foundPlural, data: filteredProfessionals };
  }

  async findOne(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.response.error.invalidID, HttpStatus.BAD_REQUEST);

    const professional = await this.professionalModel
      .findById(id)
      .populate({ path: 'specialization', select: '_id name description icon', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .populate({ path: 'title', select: '_id name abbreviation', strictPopulate: false })
      .exec();

    if (!professional) throw new HttpException(PROF_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: PROF_CONFIG.response.success.foundSingular, data: professional };
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.response.error.invalidID, HttpStatus.BAD_REQUEST);

    const update = await this.professionalModel.findByIdAndUpdate(id, updateProfessionalDto, { new: true });
    if (!update) throw new HttpException(PROF_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.updated, data: update };
  }

  async updateAvailability(id: string, availability: boolean): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.response.error.invalidID, HttpStatus.NOT_FOUND);

    const update = await this.professionalModel.findByIdAndUpdate(id, { available: availability }, { new: true });
    if (!update) throw new HttpException(PROF_CONFIG.response.error.notUpdatedAvailability, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.updatedAvailability, data: { id: update._id, available: update.available } };
  }

  // CHECKED: used on ProfessionalsDataTable.tsx
  // TODO: remove appointments associated to the professional
  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.response.error.invalidID, HttpStatus.BAD_REQUEST);

    const remove = await this.professionalModel.findByIdAndDelete(id);
    if (!remove) throw new HttpException(PROF_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.removed, data: remove };
  }

  // CHECKED:
  // used on service ProfessionalApiService.countAll()
  // used on component DBCountProfessionals.tsx
  async databaseCount(): Promise<IResponse<IDBCount>> {
    const count = await this.professionalModel.countDocuments();
    const countAvailable = await this.professionalModel.countDocuments({ available: true });
    const countNotAvailable = await this.professionalModel.countDocuments({ available: false });

    if (!count || !countAvailable || !countNotAvailable) throw new HttpException(PROF_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.databaseCount, data: { total: count, available: countAvailable, notAvailable: countNotAvailable } };
  }
}
