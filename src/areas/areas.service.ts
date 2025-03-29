import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { AREAS_CONFIG } from '@config/areas.config';
import { Area } from '@areas/schema/areas.schema';
import { CreateAreaDto } from '@areas/dto/create-area.dto';
import { UpdateAreaDto } from '@areas/dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private readonly areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto): Promise<IResponse<Area>> {
    const areaExists = await this.areaModel.findOne({ name: createAreaDto.name });
    if (areaExists) throw new HttpException(AREAS_CONFIG.response.error.duplicated, HttpStatus.CONFLICT);

    const newArea = new this.areaModel(createAreaDto);
    const createdArea = await newArea.save();
    if (!createdArea) throw new HttpException(AREAS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return {
      data: createdArea,
      message: AREAS_CONFIG.response.success.created,
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Area[]>> {
    const areas = await this.areaModel.find().sort({ name: 'asc' }).populate({
      path: 'specializations',
      select: '_id name description',
      strictPopulate: false,
    });

    if (areas.length === 0) throw new HttpException(AREAS_CONFIG.response.success.emptyPlural, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREAS_CONFIG.response.error.findingPlural, HttpStatus.BAD_REQUEST);

    return {
      data: areas,
      message: AREAS_CONFIG.response.success.foundPlural,
      statusCode: HttpStatus.OK,
    };
  }

  async findAllActive(): Promise<IResponse<Area[]>> {
    const areas = await this.areaModel.find({ active: 1 }).sort({ name: 'asc' }).populate({
      path: 'specializations',
      select: '_id name description',
      strictPopulate: false,
    });

    if (areas.length === 0) throw new HttpException(AREAS_CONFIG.response.success.emptyPlural, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREAS_CONFIG.response.error.findingPlural, HttpStatus.BAD_REQUEST);

    return {
      data: areas,
      message: AREAS_CONFIG.response.success.foundPlural,
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);

    const area = await this.areaModel.findById(id).populate([
      {
        path: 'specializations',
        select: '_id name description',
        strictPopulate: false,
      },
    ]);

    if (!area) throw new HttpException(AREAS_CONFIG.response.error.notFoundSingular, HttpStatus.BAD_REQUEST);

    return {
      data: area,
      message: AREAS_CONFIG.response.success.foundSingular,
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(AREAS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const nameExists = await this.areaModel.findOne({ name: updateAreaDto.name });
    if (nameExists && nameExists._id.toString() !== id) throw new HttpException(AREAS_CONFIG.response.error.duplicated, HttpStatus.CONFLICT);

    const updatedArea = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true });
    if (!updatedArea) throw new HttpException(AREAS_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return {
      data: updatedArea,
      message: AREAS_CONFIG.response.success.created,
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Area>> {
    const isValid: boolean = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);

    const deletedArea = await this.areaModel.findByIdAndDelete(id);
    if (!deletedArea) throw new HttpException(AREAS_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return {
      data: deletedArea,
      message: AREAS_CONFIG.response.success.removed,
      statusCode: HttpStatus.OK,
    };
  }
}
