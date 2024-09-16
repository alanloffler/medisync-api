import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { Title } from '@titles/schema/title.schema';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Injectable()
export class TitlesService {
  constructor(@InjectModel(Title.name) private readonly titleModel: Model<Title>) {}

  async create(createTitleDto: CreateTitleDto) {
    const title = await this.titleModel.create(createTitleDto);
    if (!title) throw new HttpException('Title not created', HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: 'Title created', data: title };
  }

  async findAll() {
    const titles = await this.titleModel.find().sort({ name: 'asc' });
    if (!titles) throw new HttpException('Titles not found', HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: 'Titles found', data: titles };
  }

  async findOne(id: string) {
    const title = await this.titleModel.findById(id);
    if (!title) throw new HttpException('Title not found', HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: 'Title found', data: title };
  }
  // TODO: add functionality to update title
  async update(id: string, updateTitleDto: UpdateTitleDto): Promise<IResponse> {
    return { statusCode: 200, message: 'Title updated', data: [id, updateTitleDto] };
  }
  // TODO: add functionality to remove title
  async remove(id: string): Promise<IResponse> {
    return { statusCode: 200, message: 'Title removed', data: id };
  }
}
