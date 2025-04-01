import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { TITLES_CONFIG } from '@config/titles.config';
import { Title } from '@titles/schema/title.schema';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Injectable()
export class TitlesService {
  constructor(@InjectModel(Title.name) private readonly titleModel: Model<Title>) {}

  async create(createTitleDto: CreateTitleDto): Promise<IResponse<Title>> {
    const title = await this.titleModel.create(createTitleDto);
    if (!title) throw new HttpException(TITLES_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: TITLES_CONFIG.response.success.created,
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Title[]>> {
    const titles = await this.titleModel.find().sort({ name: 'asc' });
    if (titles.length === 0) throw new HttpException('', HttpStatus.NOT_FOUND);
    if (titles === undefined || titles === null) throw new HttpException(TITLES_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    return {
      data: titles,
      message: TITLES_CONFIG.response.success.foundPlural,
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Title>> {
    const title = await this.titleModel.findById(id);
    if (!title) throw new HttpException(TITLES_CONFIG.response.error.notFoundSingular, HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: TITLES_CONFIG.response.success.foundSingular,
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateTitleDto: UpdateTitleDto): Promise<IResponse<Title>> {
    const title = await this.titleModel.findByIdAndUpdate(id, updateTitleDto, { new: true });
    if (!title) throw new HttpException('update ok', HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: TITLES_CONFIG.response.success.updated,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Title>> {
    const title = await this.titleModel.findByIdAndDelete(id);
    if (!title) throw new HttpException('Removed not ok', HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: TITLES_CONFIG.response.success.removed,
      statusCode: HttpStatus.OK,
    };
  }
}
