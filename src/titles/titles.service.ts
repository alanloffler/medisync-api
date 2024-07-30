import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Title } from './schema/title.schema';
import { Model } from 'mongoose';

@Injectable()
export class TitlesService {
  constructor(@InjectModel(Title.name) private readonly titleModel: Model<Title>) {}
  async create(createTitleDto: CreateTitleDto) {
    const title = await this.titleModel.create(createTitleDto);
    if (!title) throw new HttpException('Title not created', HttpStatus.BAD_REQUEST);
    return { statusCode: 200, message: 'Title created', data: title };
  }

  async findAll() {
    const titles = await this.titleModel.find();
    if (!titles) throw new HttpException('Titles not found', HttpStatus.BAD_REQUEST);
    return { statusCode: 200, message: 'Titles found', data: titles };
  }

  async findOne(id: string) {
    const title = await this.titleModel.findById(id);
    if (!title) throw new HttpException('Title not found', HttpStatus.BAD_REQUEST);
    return { statusCode: 200, message: 'Title found', data: title };
  }

  update(id: number, updateTitleDto: UpdateTitleDto) {
    return `This action updates a #${id} title`;
  }

  remove(id: number) {
    return `This action removes a #${id} title`;
  }
}
