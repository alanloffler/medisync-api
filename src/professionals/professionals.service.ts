import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateProfessionalDto } from './dto/create-professional.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { PROF_CONFIG } from '../common/config/professionals.config';
import { Professional } from './schema/professional.schema';
import { UpdateProfessionalDto } from './dto/update-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(@InjectModel(Professional.name) private readonly professionalModel: Model<Professional>) {}

  async create(createProfessionalDto: CreateProfessionalDto) {
    const professional = await this.professionalModel.create(createProfessionalDto);
    if (!professional) throw new HttpException(PROF_CONFIG.errors.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.success.created, data: professional };
  }

  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string) {
    if (sortingKey === 'area' || sortingKey === 'specialization') sortingKey = sortingKey + '.name';
    let obj = {};
    if (sortingValue === 'asc') obj = { [sortingKey]: 1 };
    if (sortingValue === 'desc') obj = { [sortingKey]: -1 };
    // const professionals = await this.professionalModel
    //   .find({
    //     $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
    //   })
    //   .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
    //   .populate({ path: 'area', select: '_id name description', strictPopulate: false })
    //   .skip(parseInt(skip))
    //   .limit(parseInt(limit))
    //   .exec();
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
            specialization: { _id: 1, name: 1 },
            titleAbbreviation: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            phone: 1,
            __v: 1,
          },
        },
      ])
      .exec();

    // Here do the search for the count and pageTotal
    const count = await this.professionalModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }],
      })
      .countDocuments();
    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;

    if (professionals.length === 0) throw new HttpException(PROF_CONFIG.success.searchNotFound, HttpStatus.NOT_FOUND);

    return { total: pageTotal, count: count, data: professionals };
  }

  async findAllActive(): Promise<IResponse> {
    // prettier-ignore
    const professionals = await this.professionalModel
      .find({ available: true })
      .sort({ lastName: 'asc' })
      .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .exec();

    if (professionals.length === 0) throw new HttpException(PROF_CONFIG.success.empty, HttpStatus.NOT_FOUND);
    if (!professionals) throw new HttpException(PROF_CONFIG.errors.notFound, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: PROF_CONFIG.success.foundMany, data: professionals };
  }

  async findOne(id: string): Promise<Professional> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);
    // prettier-ignore
    const professional = await this.professionalModel
      .findById(id)
      .populate({ path: 'specialization', select: '_id name description', strictPopulate: false })
      .populate({ path: 'area', select: '_id name description', strictPopulate: false })
      .exec();

    if (!professional) throw new HttpException(PROF_CONFIG.errors.notFoundOne, HttpStatus.NOT_FOUND);

    return professional;
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);

    const update = await this.professionalModel.findByIdAndUpdate(id, updateProfessionalDto, { new: true });
    if (!update) throw new HttpException(PROF_CONFIG.errors.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: PROF_CONFIG.success.updated, data: update };
  }

  async remove(id: string) {
    return await this.professionalModel.findByIdAndDelete(id);
  }
}
