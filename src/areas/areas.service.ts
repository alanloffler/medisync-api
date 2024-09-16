import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { AREAS_CONFIG } from '@config/areas.config';
import { Area } from '@areas/schema/areas.schema';
import { CreateAreaDto } from '@areas/dto/create-area.dto';
import { IResponse } from '@common/interfaces/response.interface';
import { UpdateAreaDto } from '@areas/dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(@InjectModel(Area.name) private readonly areaModel: Model<Area>) {}

  async create(createAreaDto: CreateAreaDto): Promise<IResponse> {
    const areaExists = await this.areaModel.findOne({ name: createAreaDto.name });
    if (areaExists) throw new HttpException(AREAS_CONFIG.response.error.errorDuplicate, HttpStatus.BAD_REQUEST);

    const newArea = new this.areaModel(createAreaDto);
    const createdArea = await newArea.save();
    if (!createdArea) throw new HttpException(AREAS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.created, data: createdArea };
  }

  async findAll(): Promise<IResponse> {
    // prettier-ignore
    const areas = await this.areaModel
      .find()
      .sort({ name: 'asc' })
      .populate({ path: 'specializations', select: '_id name description', strictPopulate: false });

    if (areas.length === 0) throw new HttpException(AREAS_CONFIG.response.success.emptyMany, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREAS_CONFIG.response.error.errorFindingMany, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.foundMany, data: areas };
  }

  async findAllActive(): Promise<IResponse> {
    // prettier-ignore
    const areas = await this.areaModel
      .find({ active: 1 })
      .sort({ name: 'asc' })
      .populate({ path: 'specializations', select: '_id name description', strictPopulate: false });

    if (areas.length === 0) throw new HttpException(AREAS_CONFIG.response.success.emptyMany, HttpStatus.NOT_FOUND);
    if (!areas) throw new HttpException(AREAS_CONFIG.response.error.errorFindingMany, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.foundMany, data: areas };
  }

  async findOne(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);
    // prettier-ignore
    const area = await this.areaModel
      .findById(id)
      .populate([{ path: 'specializations', select: '_id name description', strictPopulate: false }]);
      
    if (!area) throw new HttpException(AREAS_CONFIG.response.error.notFound, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.found, data: area };
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(AREAS_CONFIG.response.error.notFound, HttpStatus.NOT_FOUND);

    const nameExists = await this.areaModel.findOne({ name: updateAreaDto.name });
    if (nameExists && nameExists._id.toString() !== id) throw new HttpException(AREAS_CONFIG.response.error.errorDuplicate, HttpStatus.BAD_REQUEST);

    const updatedArea = await this.areaModel.findByIdAndUpdate(id, updateAreaDto, { new: true });
    if (!updatedArea) throw new HttpException(AREAS_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.created, data: updatedArea };
  }

  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(AREAS_CONFIG.response.error.notValid, HttpStatus.BAD_REQUEST);

    const areaExists = await this.areaModel.findById(id);
    if (!areaExists) throw new HttpException(AREAS_CONFIG.response.error.notFound, HttpStatus.NOT_FOUND);

    const deletedArea = await this.areaModel.findByIdAndDelete(id);
    if (!deletedArea) throw new HttpException(AREAS_CONFIG.response.error.notDeleted, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: AREAS_CONFIG.response.success.deleted, data: deletedArea };
  }
}
