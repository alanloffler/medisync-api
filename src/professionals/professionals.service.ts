import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateProfessionalDto } from '@professionals/dto/create-professional.dto';
import { PROFESSIONALS_CONFIG as PROF_CONFIG } from '@config/professionals.config';
import { Professional } from '@professionals/schema/professional.schema';
import { UpdateProfessionalDto } from '@professionals/dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(@InjectModel(Professional.name) private readonly professionalModel: Model<Professional>) {}

  async create(createProfessionalDto: CreateProfessionalDto): Promise<IResponse> {
    const professionalExists: Professional = await this.professionalModel.findOne({ dni: createProfessionalDto.dni });
    if (professionalExists) throw new HttpException(PROF_CONFIG.response.error.duplicatedKey, HttpStatus.BAD_REQUEST);

    const professional: Professional = await this.professionalModel.create(createProfessionalDto);
    if (!professional) throw new HttpException(PROF_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.created, data: professional };
  }

  async findBySpecialization(id: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
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

  async findAllActive(): Promise<IResponse> {
    // prettier-ignore
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

  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.response.error.invalidID, HttpStatus.BAD_REQUEST);

    const remove = await this.professionalModel.findByIdAndDelete(id);
    if (!remove) throw new HttpException(PROF_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.removed, data: remove };
  }

  async databaseCount(): Promise<IResponse> {
    const count = await this.professionalModel.countDocuments();
    const countAvailable = await this.professionalModel.countDocuments({ available: true });
    const countNotAvailable = await this.professionalModel.countDocuments({ available: false });

    if (!count || !countAvailable || !countNotAvailable) throw new HttpException(PROF_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.response.success.databaseCount, data: { total: count, available: countAvailable, notAvailable: countNotAvailable } };
  }
}
