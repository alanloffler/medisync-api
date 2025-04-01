import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateTitleDto } from '@titles/dto/create-title.dto';
import { Title } from '@titles/schema/title.schema';
import { UpdateTitleDto } from '@titles/dto/update-title.dto';

@Injectable()
export class TitlesService {
  constructor(
    @InjectModel(Title.name) private readonly titleModel: Model<Title>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createTitleDto: CreateTitleDto): Promise<IResponse<Title>> {
    const title = await this.titleModel.create(createTitleDto);
    if (!title) throw new HttpException(this.i18nService.t('exception.titles.failedCreate'), HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: this.i18nService.t('response.titles.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Title[]>> {
    const titles = await this.titleModel.find().sort({ name: 'asc' });
    if (titles.length === 0) throw new HttpException('exception.titles.emptyPlural', HttpStatus.NOT_FOUND);
    if (titles === undefined || titles === null) throw new HttpException(this.i18nService.t('exception.titles.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: titles,
      message: this.i18nService.t('response.titles.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Title>> {
    const title = await this.titleModel.findById(id);
    if (!title) throw new HttpException(this.i18nService.t('exception.titles.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: this.i18nService.t('response.titles.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateTitleDto: UpdateTitleDto): Promise<IResponse<Title>> {
    const title = await this.titleModel.findByIdAndUpdate(id, updateTitleDto, { new: true });
    if (!title) throw new HttpException(this.i18nService.t('exception.titles.failedUpdate'), HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: this.i18nService.t('response.titles.updated'),
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Title>> {
    const title = await this.titleModel.findByIdAndDelete(id);
    if (!title) throw new HttpException(this.i18nService.t('exception.titles.failedRemove'), HttpStatus.BAD_REQUEST);

    return {
      data: title,
      message: this.i18nService.t('response.titles.removed'),
      statusCode: HttpStatus.OK,
    };
  }
}
