import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import { Area } from '@areas/schema/areas.schema';
import { CreateAreaDto } from '@areas/dto/create-area.dto';
import { UpdateAreaDto } from '@areas/dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(
    @InjectModel(Area.name) private readonly areaModel: Model<Area>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<IResponse<Area>> {
    const areaExists = await this.areaModel.findOne({ name: createAreaDto.name });
    if (areaExists) throw new HttpException(this.i18nService.t('exception.areas.duplicated'), HttpStatus.CONFLICT);

    const newArea = new this.areaModel(createAreaDto);
    const createdArea = await newArea.save();
    if (!createdArea) throw new HttpException(this.i18nService.t('exception.areas.failedCreate'), HttpStatus.BAD_REQUEST);

    return {
      data: createdArea,
      message: this.i18nService.t('response.areas.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Area[]>> {
    const areas = await this.areaModel.find().sort({ name: 'asc' }).populate({
      path: 'specializations',
      select: '_id name description',
      strictPopulate: false,
    });

    if (areas.length === 0) throw new HttpException(this.i18nService.t('response.areas.emptyPlural'), HttpStatus.NOT_FOUND);
    if (areas === undefined || areas === null) throw new HttpException(this.i18nService.t('exception.areas.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: areas,
      message: this.i18nService.t('response.areas.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAllActive(): Promise<IResponse<Area[]>> {
    const areas = await this.areaModel.find({ active: 1 }).sort({ name: 'asc' }).populate({
      path: 'specializations',
      select: '_id name description',
      strictPopulate: false,
    });

    if (areas.length === 0) throw new HttpException(this.i18nService.t('response.areas.emptyPlural'), HttpStatus.NOT_FOUND);
    if (areas === undefined || areas === null) throw new HttpException(this.i18nService.t('exception.areas.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: areas,
      message: this.i18nService.t('response.areas.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const area = await this.areaModel.findById(id).populate([
      {
        path: 'specializations',
        select: '_id name description',
        strictPopulate: false,
      },
    ]);

    if (!area) throw new HttpException(this.i18nService.t('exception.areas.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: area,
      message: this.i18nService.t('response.areas.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(this.i18nService.t('exception.areas.notFound'), HttpStatus.NOT_FOUND);

    const nameExists = await this.areaModel.findOne({ name: updateAreaDto.name });
    if (nameExists && nameExists._id.toString() !== id) throw new HttpException(this.i18nService.t('exception.areas.duplicated'), HttpStatus.CONFLICT);

    const updatedArea = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true });
    if (!updatedArea) throw new HttpException(this.i18nService.t('exception.areas.failedUpdate'), HttpStatus.BAD_REQUEST);

    return {
      data: updatedArea,
      message: this.i18nService.t('response.areas.updated'),
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const deletedArea = await this.areaModel.findByIdAndDelete(id);
    if (!deletedArea) throw new HttpException(this.i18nService.t('exception.areas.failedRemove'), HttpStatus.BAD_REQUEST);

    return {
      data: deletedArea,
      message: this.i18nService.t('response.areas.removed'),
      statusCode: HttpStatus.OK,
    };
  }
}
