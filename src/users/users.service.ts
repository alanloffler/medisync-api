import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { IResponse } from '@common/interfaces/response.interface';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { USERS_CONFIG } from '@config/users.config';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<IResponse> {
    const findUser = await this.userModel.findOne({ dni: createUserDto.dni });
    if (findUser) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);

    const user = await this.userModel.create(createUserDto);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.created, data: user };
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

    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);
    if (users.length === 0) throw new HttpException(USERS_CONFIG.response.success.foundEmptyPlural, HttpStatus.NOT_FOUND);
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

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundPlural, data: data };
  }
  // Find all users by DNI (partial search of DNI => many results)
  async findAllByDNI(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
    let sorting = {};
    if (sortingValue === 'asc') sorting = { [sortingKey]: 1 };
    if (sortingValue === 'desc') sorting = { [sortingKey]: -1 };

    const users = await this.userModel
      .find({
        $expr: {
          $regexMatch: {
            input: { $toString: { $toLong: '$dni' } },
            regex: search,
          },
        },
      })
      .sort(sorting)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();

    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);
    if (users.length === 0) throw new HttpException(USERS_CONFIG.response.success.foundEmptyPlural, HttpStatus.NOT_FOUND);
    
    const count = await this.userModel
      .find({
        $expr: {
          $regexMatch: {
            input: { $toString: { $toLong: '$dni' } },
            regex: search,
          },
        },
      })
      .countDocuments();

    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;
    const data = { total: pageTotal, count: count, data: users };

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundPlural, data: data };
  }

  async findOne(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const user = await this.userModel.findById(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundSingular, data: user };
  }

  async findOneByDni(dni: number): Promise<IResponse> {
    const user = await this.userModel.findOne({ dni });
    if (user) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.NOT_FOUND);

    return;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const findDni = await this.userModel.findOne({ dni: updateUserDto.dni });
    if (findDni && findDni._id.toString() !== id) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.updated };
  }

  async remove(id: string): Promise<IResponse> {
    const isValid = isValidObjectId(id);
    if (!isValid) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.removed, data: user };
  }
}
