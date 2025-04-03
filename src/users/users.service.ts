import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { format } from '@formkit/tempo';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import type { IUserStats } from '@users/interfaces/user-stats.interface';
import type { IUsersData } from '@users/interfaces/users-data.interface';
import { CreateUserDto } from '@users/dto/create-user.dto';
import { USERS_CONFIG } from '@config/users.config';
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';

// Checked: all
// Typed response: todo findAll and findAllByIdentityNumber (reformulate type of response, then check in frontend)
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IResponse<User>> {
    if (createUserDto.dni !== undefined) {
      const findUser = await this.userModel.findOne({ dni: createUserDto.dni });
      if (findUser) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userModel.create(createUserDto);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notCreated, HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<IUsersData>> {
    let sorting = {};
    if (sortingValue === 'asc') sorting = { [sortingKey]: 1 };
    if (sortingValue === 'desc') sorting = { [sortingKey]: -1 };

    const users = await this.userModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .sort(sorting)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();

    if (users.length === 0) throw new HttpException(USERS_CONFIG.response.success.foundEmptyPlural, HttpStatus.NOT_FOUND);
    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

    const count = await this.userModel
      .find({
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .countDocuments();

    const pageTotal = Math.floor((count - 1) / parseInt(limit)) + 1;
    const data = { total: pageTotal, count: count, data: users };

    return {
      data: data,
      message: this.i18nService.t('response.users.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAllByIdentityNumber(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<IUsersData>> {
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

    if (users.length === 0) throw new HttpException(USERS_CONFIG.response.success.foundEmptyPlural, HttpStatus.NOT_FOUND);
    if (!users) throw new HttpException(USERS_CONFIG.response.error.notFoundPlural, HttpStatus.BAD_REQUEST);

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

    return {
      data: data,
      message: this.i18nService.t('response.users.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findById(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    const findDni = await this.userModel.findOne({ dni: updateUserDto.dni });
    if (findDni && findDni._id.toString() !== id) throw new HttpException(USERS_CONFIG.response.error.alreadyExist, HttpStatus.BAD_REQUEST);

    // const findUser = await this.userModel.findById(id);
    // if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notUpdated, HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: USERS_CONFIG.response.success.updated,
      statusCode: HttpStatus.OK,
    };
  }

  // TODO: remove appointments associated to the user
  async remove(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(USERS_CONFIG.response.error.invalidId, HttpStatus.BAD_REQUEST);

    // const findUser: User = await this.userModel.findById(id);
    // if (!findUser) throw new HttpException(USERS_CONFIG.response.error.notFoundSingular, HttpStatus.NOT_FOUND);

    const user: User = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException(USERS_CONFIG.response.error.notRemoved, HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: USERS_CONFIG.response.success.removed,
      statusCode: HttpStatus.OK,
    };
  }

  async newUsersToday(): Promise<IResponse<IUserStats>> {
    const countAll = await this.userModel.countDocuments();
    if (!countAll) throw new HttpException(USERS_CONFIG.response.error.databaseCount, HttpStatus.BAD_REQUEST);

    const today: string = format(new Date(), 'YYYY-MM-DD');
    const countToday: number = await this.userModel.countDocuments({ createdAt: { $gte: today } });

    const data = {
      percentage: countToday ? (countToday * 100) / countAll : 0,
      today: countToday,
      total: countAll,
    };

    return {
      data: data,
      message: USERS_CONFIG.response.success.databaseCount,
      statusCode: HttpStatus.OK,
    };
  }
}
