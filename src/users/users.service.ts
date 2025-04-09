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
import { UpdateUserDto } from '@users/dto/update-user.dto';
import { User } from '@users/schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IResponse<User>> {
    if (createUserDto.dni !== undefined) {
      const findUser: User = await this.userModel.findOne({ dni: createUserDto.dni }).exec();
      if (findUser) throw new HttpException(this.i18nService.t('exception.users.alreadyExists'), HttpStatus.BAD_REQUEST);
    }

    const user: User = await this.userModel.create(createUserDto);
    if (!user) throw new HttpException(this.i18nService.t('exception.users.failedCreate'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.created'),
      statusCode: HttpStatus.OK,
    };
  }

  async findAll(search: string, limit: string, skip: string, sortingKey: string, sortingValue: string): Promise<IResponse<IUsersData>> {
    // TODO: check params or put default
    let sorting = {};
    if (sortingValue === 'asc') sorting = { [sortingKey]: 1 };
    if (sortingValue === 'desc') sorting = { [sortingKey]: -1 };

    const users: User[] = await this.userModel
      .find({
        isDeleted: false,
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .sort(sorting)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();

    if (users.length === 0) throw new HttpException(this.i18nService.t('exception.users.emptyPlural'), HttpStatus.NOT_FOUND);
    if (!users) throw new HttpException(this.i18nService.t('exception.users.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const count: number = await this.userModel
      .find({
        isDeleted: false,
        $or: [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }],
      })
      .countDocuments();
    const pageTotal: number = Math.floor((count - 1) / parseInt(limit)) + 1;
    const data: IUsersData = { total: pageTotal, count: count, data: users };

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

    const users: User[] = await this.userModel
      .find({
        isDeleted: false,
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

    if (users.length === 0) throw new HttpException(this.i18nService.t('exception.users.emptyPlural'), HttpStatus.NOT_FOUND);
    if (!users) throw new HttpException(this.i18nService.t('exception.users.notFoundPlural'), HttpStatus.BAD_REQUEST);

    const count: number = await this.userModel
      .find({
        isDeleted: false,
        $expr: {
          $regexMatch: {
            input: { $toString: { $toLong: '$dni' } },
            regex: search,
          },
        },
      })
      .countDocuments();
    const pageTotal: number = count ? Math.floor((count - 1) / parseInt(limit)) + 1 : 0;
    const data: IUsersData = { total: pageTotal, count: count, data: users };

    return {
      data: data,
      message: this.i18nService.t('response.users.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async findOne(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
    if (!user) throw new HttpException(this.i18nService.t('exception.users.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.found'),
      statusCode: HttpStatus.OK,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const findDni: User = await this.userModel.findOne({ dni: updateUserDto.dni }).exec();
    if (findDni && findDni._id.toString() !== id) throw new HttpException(this.i18nService.t('exception.users.alreadyExists'), HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).where({ isDeleted: false }).exec();
    if (!user) throw new HttpException(this.i18nService.t('exception.users.failedUpdate'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.updated'),
      statusCode: HttpStatus.OK,
    };
  }

  // TODO: remove appointments associated to the user
  async remove(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new HttpException(this.i18nService.t('exception.users.failedRemove'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.removed'),
      statusCode: HttpStatus.OK,
    };
  }

  async findRemovedUsers(): Promise<IResponse<User[]>> {
    const users: User[] = await this.userModel.find({ isDeleted: true }).exec();
    if (users.length === 0) return { data: [], message: this.i18nService.t('exception.users.emptyPlural'), statusCode: HttpStatus.NOT_FOUND };
    if (!users) throw new HttpException(this.i18nService.t('exception.users.notFoundPlural'), HttpStatus.BAD_REQUEST);

    return {
      data: users,
      message: this.i18nService.t('response.users.foundPlural'),
      statusCode: HttpStatus.OK,
    };
  }

  async delete(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!user) throw new HttpException(this.i18nService.t('exception.users.failedDelete'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.deleted'),
      statusCode: HttpStatus.OK,
    };
  }

  async restore(id: string): Promise<IResponse<User>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const user: User = await this.userModel.findByIdAndUpdate(id, { isDeleted: false }, { new: true }).where({ isDeleted: true }).exec();
    if (!user) throw new HttpException(this.i18nService.t('exception.users.notFound'), HttpStatus.BAD_REQUEST);

    return {
      data: user,
      message: this.i18nService.t('response.users.restored'),
      statusCode: HttpStatus.OK,
    };
  }

  async newUsersToday(): Promise<IResponse<IUserStats>> {
    const countAll: number = await this.userModel.countDocuments({ isDeleted: false }).exec();
    if (!countAll) throw new HttpException(this.i18nService.t('exception.users.notFoundUsers'), HttpStatus.BAD_REQUEST);

    const today: string = format(new Date(), 'YYYY-MM-DD');
    const countToday: number = await this.userModel.countDocuments({ createdAt: { $gte: today }, isDeleted: false }).exec();
    if (countToday === undefined || countToday === null) throw new HttpException(this.i18nService.t('exception.users.notFoundNewUsers'), HttpStatus.BAD_REQUEST);

    const data = {
      percentage: countToday ? (countToday * 100) / countAll : 0,
      today: countToday,
      total: countAll,
    };

    return {
      data: data,
      message: this.i18nService.t('response.users.databaseCount'),
      statusCode: HttpStatus.OK,
    };
  }
}
