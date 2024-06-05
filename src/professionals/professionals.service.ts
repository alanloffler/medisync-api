import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateProfessionalDto } from './dto/create-professional.dto';
import { Professional } from './schema/professional.schema';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { PROF_CONFIG } from 'src/common/config/professionals.config';

@Injectable()
export class ProfessionalsService {
  constructor(@InjectModel(Professional.name) private readonly professionalModel: Model<Professional>) {}

  async create(createProfessionalDto: CreateProfessionalDto) {
    const professional = await this.professionalModel.create(createProfessionalDto);
    if (!professional) throw new HttpException(PROF_CONFIG.errors.notCreated, HttpStatus.BAD_REQUEST);
    return { statusCode: 200, message: PROF_CONFIG.success.created, data: professional };
  }

  async findAll() {
    const professionals = await this.professionalModel.find();
    if (professionals.length === 0) throw new HttpException(PROF_CONFIG.success.empty, HttpStatus.NOT_FOUND);
    
    return professionals;
  }

  async findOne(id: string): Promise<Professional> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(PROF_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);

    const professional = await this.professionalModel.findById(id);
    if (!professional) throw new HttpException(PROF_CONFIG.errors.notFound, HttpStatus.NOT_FOUND);

    return professional;
  }

  async update(id: string, updateProfessionalDto: UpdateProfessionalDto) {
    const update = await this.professionalModel.findByIdAndUpdate(id, updateProfessionalDto, { new: true });
    console.log(update);
    return update;
  }

  async remove(id: string) {
    return await this.professionalModel.findByIdAndDelete(id);
  }
}
