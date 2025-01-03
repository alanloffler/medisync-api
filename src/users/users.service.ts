import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { format } from '@formkit/tempo';
import { z } from 'zod';

import type { IResponse } from '@common/interfaces/response.interface';
import type { IUserStats } from './interfaces/user-stats.interface';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { USERS_CONFIG } from '@config/users.config';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';

interface IDataUser {
  total: number;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  // CHECKED: used on CreateUser.tsx
  async create(createUserDto: CreateUserDto): Promise<IResponse<User>> {
    if (createUserDto.dni !== undefined) {
      const findUser = await this.userModel.findOne({ dni: createUserDto.dni });
      if (findUser) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.create(createUserDto);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.created, data: user };
  }

  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
    let sorting = {};
    if (sortingValue === 'asc') sorting = { [sortingKey]: 1 };
    if (sortingValue === 'desc') sorting = { [sortingKey]: -1 };

    const emptyDatabase = await this.userModel.find().countDocuments();
    if (emptyDatabase === 0) return { statusCode: 200, message: USERS_CONFIG.response.success.emptyDatabase, data: [] };

    const users = await this.userModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .sort(sorting)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();

    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);
    if (users.length === 0) throw new HttpException(USERS_CONFIG.response.success.foundEmptyPlural, HttpStatus.NOT_FOUND);

    const count = await this.userModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .countDocuments();

    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;
    const data = { total: pageTotal, count: count, data: users };

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundPlural, data: data };
  }

  async findAllByIdentityNumber(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse> {
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

    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);
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

  // CHECKED: used on
  // SendEmail.tsx
  // UpdateUser.tsx
  // WhatsApp.tsx
  async findOne(id: string): Promise<IResponse<User>> {
    const isValidID: boolean = isValidObjectId(id);
    if (!isValidID) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findById(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundSingular, data: user };
  }

  async findOneByDni(dni: number): Promise<IResponse> {
    const user = await this.userModel.findOne({ dni });
    if (user) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.NOT_FOUND);

    return;
  }
  
  // CHECKED: used on UpdateUser.tsx
  async update(id: string, updateUserDto: UpdateUserDto): Promise<IResponse<User>> {
    const isValidID: boolean = isValidObjectId(id);
    if (!isValidID) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const findDni = await this.userModel.findOne({ dni: updateUserDto.dni });
    if (findDni && findDni._id.toString() !== id) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);

    const findUser = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.updated, data: user };
  }

  // CHECKED: used on UsersDataTable.tsx
  // TODO: remove appointments associated to the user
  async remove(id: string): Promise<IResponse> {
    const isValidID: boolean = isValidObjectId(id);
    if (!isValidID) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const findUser: User = await this.userModel.findById(id);
    if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user: User = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.removed, data: user };
  }

  async databaseCount(): Promise<IResponse<IDataUser>> {
    const count = await this.userModel.countDocuments();
    if (!count) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: { total: count } };
  }

  // CHECKED: used on DBCountUsers.tsx
  // POSSIBLE RENAMED
  // TODO: send data customized for use
  async countByMonth(month: string, year: string): Promise<IResponse<IDataUser>> {
    const _month = parseInt(month);
    const _year = parseInt(year);
    const actualYear = new Date().getFullYear();

    const monthSchema = z.number().min(1).max(12);
    const yearSchema = z.number().min(2022).max(actualYear);

    if (!monthSchema.safeParse(_month).success) throw new HttpException(USERS_CONFIG.inlineValidation.month, HttpStatus.BAD_REQUEST);
    if (!yearSchema.safeParse(_year).success) throw new HttpException(USERS_CONFIG.inlineValidation.year, HttpStatus.BAD_REQUEST);

    const startDate = new Date(_year, _month - 1, 1);
    const endDate = new Date(_year, _month, 1);

    const count = await this.userModel.countDocuments({ createdAt: { $gte: startDate, $lt: endDate } });

    if (count === 0) return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: { total: 0 } };
    if (!count) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    const allUsers = await this.userModel.countDocuments();
    if (!allUsers) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);
    // console.log((count * 100) / allUsers);
    return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: { total: (count * 100) / allUsers } };
  }

  // CHECKED: used on DBCountUsers.tsx
  // TODO: removed the countByMonth method if not used
  async newUsersToday(): Promise<IResponse<IUserStats>> {
    const countAll = await this.userModel.countDocuments();
    if (!countAll) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    const today = format(new Date(), 'YYYY-MM-DD');
    const countToday = await this.userModel.countDocuments({ createdAt: { $gte: today } });

    const data = {
      percentage: countToday ? (countToday * 100) / countAll : 0,
      today: countToday,
      total: countAll,
    };

    return { statusCode: 200, message: USERS_CONFIG.response.success.databaseCount, data: data };
  }
  // Dashboard methods
  async countAll(): Promise<IResponse> {
    const countAll = await this.userModel.countDocuments();
    if (!countAll) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);

    const countLastMonth = await this.userModel.countDocuments({ createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) } });
    if (!countLastMonth) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.NOT_FOUND);

    return { statusCode: 200, message: USERS_CONFIG.response.success.foundPlural, data: { value1: countAll, value2: countLastMonth } };
  }
}
