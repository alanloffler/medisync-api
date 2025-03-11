import * as bcryptjs from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';
import { UpdateAdminDto } from '@admin/dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private readonly adminModel: Model<Admin>) {}

  async create(createAdminDto: CreateAdminDto): Promise<IResponse<Admin>> {
    if (createAdminDto.email !== undefined) {
      const alreadyRegistered: Admin = await this.adminModel.findOne({ email: createAdminDto.email });
      if (alreadyRegistered) throw new HttpException('Failed to create admin, email already exists', HttpStatus.CONFLICT);
    }

    const admin: Admin = await this.adminModel.create(createAdminDto);
    if (!admin) throw new HttpException('Failed to create admin', HttpStatus.BAD_REQUEST);

    return { data: admin, message: 'Admin created successfully', statusCode: HttpStatus.CREATED };
  }

  async findAll(): Promise<IResponse<Admin[]>> {
    const admins: Admin[] = await this.adminModel.find();
    if (!admins) throw new HttpException('Admins not found', HttpStatus.NOT_FOUND);

    return { data: admins, message: 'Admins found successfully', statusCode: HttpStatus.OK };
  }

  async findOne(id: string): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid admin ID', HttpStatus.BAD_REQUEST);

    const admin: Admin = await this.adminModel.findById(id);
    if (!admin) throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

    return { data: admin, message: 'Admin found successfully', statusCode: HttpStatus.OK };
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid admin ID', HttpStatus.BAD_REQUEST);

    if (updateAdminDto.email !== undefined) {
      const alreadyRegistered: Admin = await this.adminModel.findOne({ email: updateAdminDto.email });
      if (alreadyRegistered) throw new HttpException('Failed to update admin, email already exists', HttpStatus.CONFLICT);
    }

    if (updateAdminDto.password !== undefined) {
      const hashedPassword: string = await bcryptjs.hash(updateAdminDto.password, 10);
      updateAdminDto.password = hashedPassword;
    }

    const admin: Admin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true });
    if (!admin) throw new HttpException('Failed to update admin', HttpStatus.BAD_REQUEST);

    return { data: admin, message: 'Admin updated successfully', statusCode: HttpStatus.OK };
  }

  async remove(id: string): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException('Invalid admin ID', HttpStatus.BAD_REQUEST);

    const admin: Admin = await this.adminModel.findById(id);
    if (!admin) throw new HttpException('Failed to remove admin, admin not found', HttpStatus.NOT_FOUND);

    const adminToRemove: Admin = await this.adminModel.findByIdAndDelete(id);
    if (!adminToRemove) throw new HttpException('Failed to remove admin', HttpStatus.BAD_REQUEST);

    return { data: adminToRemove, message: 'Admin removed successfully', statusCode: HttpStatus.OK };
  }
}
