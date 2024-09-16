import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { TITLES_CONFIG } from '@/config/titles.config';
import { Title } from '@titles/schema/title.schema';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Injectable()
export class TitlesService {
  constructor(@InjectModel(Title.name) private readonly titleModel: Model<Title>) {}

  async create(createTitleDto: CreateTitleDto): Promise<IResponse> {
    const title = await this.titleModel.create(createTitleDto);
    if (!title) throw new HttpException(TITLES_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: TITLES_CONFIG.response.success.created, data: title };
  }

  async findAll(): Promise<IResponse> {
    const titles = await this.titleModel.find().sort({ name: 'asc' });
    if (!titles) throw new HttpException(TITLES_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: TITLES_CONFIG.response.success.foundPlural, data: titles };
  }

  async findOne(id: string): Promise<IResponse> {
    const title = await this.titleModel.findById(id);
    if (!title) throw new HttpException(TITLES_CONFIG.response.error.notFoundSingular, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: TITLES_CONFIG.response.success.foundSingular, data: title };
  }
  // TODO: add functionality to update title
  async update(id: string, updateTitleDto: UpdateTitleDto): Promise<IResponse> {
    return { statusCode: 200, message: TITLES_CONFIG.response.success.updated, data: [id, updateTitleDto] };
  }
  // TODO: add functionality to remove title
  async remove(id: string): Promise<IResponse> {
    return { statusCode: 200, message: TITLES_CONFIG.response.success.removed, data: id };
  }
}
