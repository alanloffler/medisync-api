import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { AREA_CONFIG } from '../common/config/area.config';
import { Area } from './schema/areas.schema';
import { CreateAreaDto } from './dto/create-area.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private readonly areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto): Promise<IResponse> {
    const areaExists = await this.areaModel.findOne({ name: createAreaDto.name });
    if (areaExists) throw new HttpException(AREA_CONFIG.errors.errorDuplicate, HttpStatus.BAD_REQUEST);

    const newArea = new this.areaModel(createAreaDto);
    const createdArea = await newArea.save();
    if (!createdArea) throw new HttpException(AREA_CONFIG.errors.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREA_CONFIG.success.created, data: createdArea };
  }

  async findAll(): Promise<Area[]> {
    const areas = await this.areaModel.find().populate({ path: 'specializations', select: 'name description' });
    if (areas.length === 0) throw new HttpException(AREA_CONFIG.success.empty, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREA_CONFIG.errors.errorFinding, HttpStatus.BAD_REQUEST);

    console.log(JSON.stringify(areas, null, 2));

    return areas;
  }

  async findAllActive(): Promise<Area[]> {
    const areas = await this.areaModel.find({ active: 1 });
    if (areas.length === 0) throw new HttpException(AREA_CONFIG.success.empty, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREA_CONFIG.errors.errorFinding, HttpStatus.BAD_REQUEST);

    return areas;
  }

  async findOne(id: string): Promise<Area> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREA_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);

    const area = await this.areaModel.findById(id).populate(['specialization']);
    if (!area) throw new HttpException(AREA_CONFIG.errors.notFound, HttpStatus.NOT_FOUND);
    console.log(area);
    return area;
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREA_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(AREA_CONFIG.errors.notFound, HttpStatus.NOT_FOUND);

    const nameExists = await this.areaModel.findOne({ name: updateAreaDto.name });
    if (nameExists && nameExists._id.toString() !== id) throw new HttpException(AREA_CONFIG.errors.errorDuplicate, HttpStatus.BAD_REQUEST);

    const updatedArea = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true });
    if (!updatedArea) throw new HttpException(AREA_CONFIG.errors.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREA_CONFIG.success.created, data: updatedArea };
  }

  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREA_CONFIG.errors.notValid, HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(AREA_CONFIG.errors.notFound, HttpStatus.NOT_FOUND);

    const deletedArea = await this.areaModel.findByIdAndDelete(id);
    if (!deletedArea) throw new HttpException(AREA_CONFIG.errors.notDeleted, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREA_CONFIG.success.deleted, data: deletedArea };
  }
}
