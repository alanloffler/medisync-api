import { InjectModel } from '@nestjs/mongoose';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { IResponse } from '../common/interfaces/response.interface';
import { USER_CONFIG } from '../config/users.config';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<IResponse> {
    const findUser = await this.findOneByDni(createUserDto.dni);
    if (findUser) throw new HttpException(USER_CONFIG.service.error.userExistence, HttpStatus.BAD_REQUEST);

    const user = await this.userModel.create(createUserDto);
    if (!user) throw new HttpException(USER_CONFIG.service.error.userCreation, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USER_CONFIG.service.success.userCreation, data: user };
  }
  // Find all users by firstName and lastName
  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
    let sorting = {};
    if (sortingValue === 'asc') sorting = { [sortingKey]: 1 };
    if (sortingValue === 'desc') sorting = { [sortingKey]: -1 };

    const users = await this.userModel
      .find({
        // prettier-ignore
        $or: [
          { firstName: { $regex: search, $options: 'i' } }, 
          { lastName: { $regex: search, $options: 'i' } }
        ],
      })
      .sort(sorting)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();

    if (!users) throw new HttpException(USER_CONFIG.service.error.userFoundMany, HttpStatus.NOT_FOUND);
    if (users.length === 0) throw new HttpException(USER_CONFIG.service.success.userFoundManyEmpty, HttpStatus.NOT_FOUND);
      // Data for pagination
    const count = await this.userModel
      .find({
        // prettier-ignore
        $or: [
          { firstName: { $regex: search, $options: 'i' } }, 
          { lastName: { $regex: search, $options: 'i' } }
        ],
      })
      .countDocuments();
    
    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;
    const data = { total: pageTotal, count: count, data: users };

    return { statusCode: 200, message: USER_CONFIG.service.success.userFoundMany, data: data };
  }

  async findOne(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USER_CONFIG.service.error.userInvalidId, HttpStatus.BAD_REQUEST);

    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException(USER_CONFIG.service.error.userFound, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: USER_CONFIG.service.success.userFound, data: user };
  }

  async findOneByDni(dni: number): Promise<IResponse> {
    const user = await this.userModel.findOne({ dni });
    if (user) throw new HttpException(USER_CONFIG.service.error.userExistence, HttpStatus.NOT_FOUND);

    return;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USER_CONFIG.service.error.userInvalidId, HttpStatus.BAD_REQUEST);

    const findDni = await this.userModel.findOne({ dni: updateUserDto.dni });
    if (findDni && findDni._id.toString() !== id) throw new HttpException(USER_CONFIG.service.error.userExistence, HttpStatus.BAD_REQUEST);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USER_CONFIG.service.error.userFound, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) throw new HttpException(USER_CONFIG.service.error.userUpdate, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USER_CONFIG.service.success.userUpdate };
  }

  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USER_CONFIG.service.error.userInvalidId, HttpStatus.BAD_REQUEST);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USER_CONFIG.service.error.userFound, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException(USER_CONFIG.service.error.userRemove, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USER_CONFIG.service.success.userRemove, data: user };
  }
}
