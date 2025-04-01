import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateSpecializationDto } from '@specializations/dto/create-specialization.dto';
import { SPECIALIZATIONS_CONFIG as SPEC_CONFIG } from '@config/specializations.config';
import { Specialization } from '@specializations/schema/specializations.schema';
import { UpdateSpecializationDto } from '@specializations/dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(@InjectModel(Specialization.name) private readonly specializationModel: Model<Specialization>) {}

  async create(createSpecializationDto: CreateSpecializationDto): Promise<IResponse<Specialization>> {
    const newSpecialization = new this.specializationModel(createSpecializationDto);
    const createSpecialization = await this.specializationModel.create(newSpecialization);
    if (!createSpecialization) throw new HttpException(SPEC_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return {
      data: createSpecialization,
      message: SPEC_CONFIG.response.success.created,
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Specialization[]>> {
    // return this.specializationModel.find().populate('area');ok
    const specializations = await this.specializationModel.find().sort({ name: 'asc' });
    if (!specializations) throw new HttpException(SPEC_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    return {
      data: specializations,
      message: SPEC_CONFIG.response.success.foundPlural,
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Specialization>> {
    const specialization = await this.specializationModel.findById(id);
    if (!specialization) throw new HttpException('not find', HttpStatus.BAD_REQUEST);

    return {
      data: specialization,
      message: SPEC_CONFIG.response.success.foundSingular,
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateSpecializationDto: UpdateSpecializationDto): Promise<IResponse<Specialization>> {
    const updated = await this.specializationModel.findByIdAndUpdate(id, updateSpecializationDto, { new: true });
    if (!updated) throw new HttpException(SPEC_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return {
      data: updated,
      message: SPEC_CONFIG.response.success.created,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Specialization>> {
    const specialization = await this.specializationModel.findByIdAndDelete(id);
    if (!specialization) throw new HttpException('not removed', HttpStatus.BAD_REQUEST);

    return {
      data: specialization,
      message: SPEC_CONFIG.response.success.removed,
      statusCode: HttpStatus.OK,
    };
  }
}
