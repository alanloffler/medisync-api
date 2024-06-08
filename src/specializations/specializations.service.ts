import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { SPEC_CONFIG } from '../common/config/specialization.config';
import { Specialization } from './schema/specializations.schema';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(@InjectModel(Specialization.name) private readonly specializationModel: Model<Specialization>) {}

  async create(createSpecializationDto: CreateSpecializationDto): Promise<IResponse> {
    const newSpecialization = new this.specializationModel(createSpecializationDto);
    const createSpecialization = await this.specializationModel.create(newSpecialization);
    if (!createSpecialization) throw new HttpException(SPEC_CONFIG.errors.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: SPEC_CONFIG.success.created, data: createSpecialization };
  }

  async findAll() {
    // return await this.specializationModel.find();
    // return this.specializationModel.find().populate('area');ok
    return await this.specializationModel.find();
  }

  findOne(id: string) {
    return `This action returns a #${id} specialization`;
  }

  update(id: string, updateSpecializationDto: UpdateSpecializationDto) {
    return `This action updates a #${id} specialization`;
  }

  remove(id: string) {
    return `This action removes a #${id} specialization`;
  }
}
