import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateSpecializationDto } from '@specializations/dto/create-specialization.dto';
import { SPECIALIZATIONS_CONFIG as SPEC_CONFIG } from '@config/specializations.config';
import { Specialization } from '@specializations/schema/specializations.schema';
import { UpdateSpecializationDto } from '@specializations/dto/update-specialization.dto';

@Injectable()
export class SpecializationsService {
  constructor(
    @InjectModel(Specialization.name) private readonly specializationModel: Model<Specialization>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createSpecializationDto: CreateSpecializationDto): Promise<IResponse<Specialization>> {
    const newSpecialization = new this.specializationModel(createSpecializationDto);
    const createSpecialization = await this.specializationModel.create(newSpecialization);
    if (!createSpecialization) throw new HttpException(this.i18nService.t('exception.specializations.failedCreate'), HttpStatus.BAD_REQUEST);

    return {
      data: createSpecialization,
      message: this.i18nService.t('response.specializations.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(): Promise<IResponse<Specialization[]>> {
    const specializations = await this.specializationModel.find().sort({ name: 'asc' });
    if (specializations.length === 0) throw new HttpException(this.i18nService.t('exception.specializations.emptyPlural'), HttpStatus.NOT_FOUND);
    if (specializations === undefined || specializations === null) throw new HttpException(this.i18nService.t('exception.specializations.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: specializations,
      message: this.i18nService.t('response.specializations.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<Specialization>> {
    const specialization = await this.specializationModel.findById(id);
    if (!specialization) throw new HttpException(this.i18nService.t('exception.specializations.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: specialization,
      message: this.i18nService.t('response.specializations.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateSpecializationDto: UpdateSpecializationDto): Promise<IResponse<Specialization>> {
    const updated = await this.specializationModel.findByIdAndUpdate(id, updateSpecializationDto, { new: true });
    if (!updated) throw new HttpException(this.i18nService.t('exception.specializations.failedUpdate'), HttpStatus.BAD_REQUEST);

    return {
      data: updated,
      message: this.i18nService.t('response.specializations.updated'),
      statusCode: HttpStatus.OK,
    };
  }

  async remove(id: string): Promise<IResponse<Specialization>> {
    const specialization = await this.specializationModel.findByIdAndDelete(id);
    if (!specialization) throw new HttpException(this.i18nService.t('exception.specializations.failedRemove'), HttpStatus.BAD_REQUEST);

    return {
      data: specialization,
      message: this.i18nService.t('response.specializations.removed'),
      statusCode: HttpStatus.OK,
    };
  }
}
