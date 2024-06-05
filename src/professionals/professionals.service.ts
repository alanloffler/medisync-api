import { Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { UpdateProfessionalDto } from './dto/update-professional.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Professional } from './schema/professional.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProfessionalsService {
  constructor(@InjectModel('Professional') private readonly professionalModel: Model<Professional>) {}
  // @InjectModel(Cat.name) private catModel: Model<Cat>

  async create(createProfessionalDto: CreateProfessionalDto) {
    return await this.professionalModel.create(createProfessionalDto);
    
  }

  async findAll() {
    return await this.professionalModel.find().exec();
    // return `This action returns all professionals`;
  }

  async findOne(id: string) {
    return await this.professionalModel.findById(id).exec();
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
