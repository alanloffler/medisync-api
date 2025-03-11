import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';
import { UpdateAdminDto } from '@admin/dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<IResponse<Admin>> {
    if (createAdminDto.email !== undefined) {
      const alreadyRegistered = await this.adminModel.findOne({ email: createAdminDto.email });
      if (alreadyRegistered) throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const admin = await this.adminModel.create(createAdminDto);
    if (!admin) throw new HttpException('Failed to create admin', HttpStatus.BAD_REQUEST);

    return { data: admin, message: 'Admin created successfully', statusCode: HttpStatus.CREATED };
  }

  async findAll(): Promise<IResponse<Admin[]>> {
    const admins = await this.adminModel.find();
    if (!admins) throw new HttpException('No admins found', HttpStatus.NOT_FOUND);

    return { data: admins, message: 'Admins found successfully', statusCode: HttpStatus.OK };
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
