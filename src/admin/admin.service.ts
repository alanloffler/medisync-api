import * as bcryptjs from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IResponse } from '@common/interfaces/response.interface';
import type { ITokens } from '@auth/interface/tokens.interface';
import { Admin } from '@admin/schema/admin.schema';
import { AuthService } from '@auth/auth.service';
import { CreateAdminDto } from '@admin/dto/create-admin.dto';
import { UpdateAdminDto } from '@admin/dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly authService: AuthService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<IResponse<Admin>> {
    if (createAdminDto.email !== undefined) {
      const alreadyRegistered: Admin = await this.adminModel.findOne({ email: createAdminDto.email });
      if (alreadyRegistered) throw new HttpException(this.i18nService.t('exception.admin.alreadyRegisteredCreate'), HttpStatus.CONFLICT);
    }

    const passwordHashed: string = await bcryptjs.hash(createAdminDto.password, 10);
    createAdminDto.password = passwordHashed;

    const admin: Admin = await this.adminModel.create(createAdminDto);
    if (!admin) throw new HttpException(this.i18nService.t('exception.admin.failedCreate'), HttpStatus.BAD_REQUEST);

    const tokens: ITokens = await this.authService.getTokens({ _id: admin._id, email: admin.email, role: admin.role });
    await this.authService.updateRefreshToken(admin._id, tokens.refreshToken);

    // TODO: Here send tokens by http-only cookie

    return { data: admin, message: this.i18nService.t('response.admin.created'), statusCode: HttpStatus.CREATED };
  }

  async findAll(): Promise<IResponse<Admin[]>> {
    const admins: Admin[] = await this.adminModel.find();
    if (!admins) throw new HttpException(this.i18nService.t('exception.admin.notFoundPlural'), HttpStatus.NOT_FOUND);

    return { data: admins, message: this.i18nService.t('response.admin.foundPlural'), statusCode: HttpStatus.OK };
  }

  async findOne(id: string): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const admin: Admin = await this.adminModel.findById(id);
    if (!admin) throw new HttpException(this.i18nService.t('exception.admin.notFound'), HttpStatus.NOT_FOUND);

    return { data: admin, message: this.i18nService.t('response.admin.found'), statusCode: HttpStatus.OK };
  }

  async update(id: string, updateAdminDto: UpdateAdminDto): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    if (updateAdminDto.email !== undefined) {
      const alreadyRegistered: Admin = await this.adminModel.findOne({ email: updateAdminDto.email });
      if (alreadyRegistered && alreadyRegistered._id !== id) throw new HttpException(this.i18nService.t('exception.admin.alreadyRegisteredUpdate'), HttpStatus.CONFLICT);
    }

    if (updateAdminDto.password !== undefined) {
      const passwordHashed: string = await bcryptjs.hash(updateAdminDto.password, 10);
      updateAdminDto.password = passwordHashed;
    }

    const admin: Admin = await this.adminModel.findByIdAndUpdate(id, updateAdminDto, { new: true });
    if (!admin) throw new HttpException(this.i18nService.t('exception.admin.failedUpdate'), HttpStatus.BAD_REQUEST);

    return { data: admin, message: this.i18nService.t('response.admin.updated'), statusCode: HttpStatus.OK };
  }

  async remove(id: string): Promise<IResponse<Admin>> {
    const isValidId: boolean = isValidObjectId(id);
    if (!isValidId) throw new HttpException(this.i18nService.t('exception.common.invalidId'), HttpStatus.BAD_REQUEST);

    const admin: Admin = await this.adminModel.findById(id);
    if (!admin) throw new HttpException(this.i18nService.t('exception.admin.failedRemoveNotFound'), HttpStatus.NOT_FOUND);

    const adminToRemove: Admin = await this.adminModel.findByIdAndDelete(id);
    if (!adminToRemove) throw new HttpException(this.i18nService.t('exception.admin.failedRemove'), HttpStatus.BAD_REQUEST);

    return { data: adminToRemove, message: this.i18nService.t('response.admin.removed'), statusCode: HttpStatus.OK };
  }
}
