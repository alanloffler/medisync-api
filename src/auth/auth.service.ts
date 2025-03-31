import * as bcryptjs from 'bcryptjs';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import type { ITokens } from '@auth/interface/tokens.interface';
import { Admin } from '@admin/schema/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly jwtService: JwtService,
  ) {}

  public async loginWithCredentials(req: IRequest, res: Response): Promise<IResponse<IPayload>> {
    const payload: IPayload = {
      _id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    };

    const tokens: ITokens = await this.getTokens(payload);
    await this.updateRefreshToken(payload._id, tokens.refreshToken);

    this.setTokenCookies(res, tokens);

    return {
      data: payload,
      message: this.i18nService.t('response.auth.login'),
      statusCode: HttpStatus.OK,
    };
  }

  public async getAdmin(user: IPayload): Promise<IResponse<Admin>> {
    const admin: Admin = await this.adminModel.findById(user._id, { password: false, refreshToken: false });
    if (!admin) throw new HttpException(this.i18nService.t('exception.auth.notFound'), HttpStatus.NOT_FOUND);

    return {
      data: admin,
      message: this.i18nService.t('response.auth.admin', { lang: I18nContext.current().lang }),
      statusCode: HttpStatus.OK,
    };
  }

  public async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin: Admin = await this.adminModel.findOne({ email });
    if (!admin) return null;

    const passwordIsValid: boolean = await bcryptjs.compare(password, admin.password);
    if (!passwordIsValid) return null;

    return admin;
  }

  public async getTokens(payload: IPayload): Promise<ITokens> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        }),
        this.jwtService.signAsync(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(this.i18nService.translate('exception.auth.failedTokens'), HttpStatus.BAD_REQUEST);
    }
  }

  public async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const tokenUpdate: Admin = await this.adminModel.findByIdAndUpdate(id, { refreshToken });
    if (!tokenUpdate) throw new HttpException(this.i18nService.translate('exception.auth.failedRefreshToken'), HttpStatus.BAD_REQUEST);

    return;
  }

  public async logout(user: IPayload, res: Response): Promise<IResponse<IPayload>> {
    const id: string = user._id;
    await this.updateRefreshToken(id, null);

    this.clearTokenCookies(res);

    return {
      data: null,
      message: this.i18nService.translate('response.auth.logout'),
      statusCode: HttpStatus.OK,
    };
  }

  public async refreshTokens(user: IPayload, refreshToken: string, res: Response): Promise<IResponse<IPayload>> {
    const admin: Admin = await this.adminModel.findById(user._id);
    if (!admin || !admin.refreshToken) throw new HttpException(this.i18nService.translate('exception.auth.unauthorized.refreshToken'), HttpStatus.UNAUTHORIZED);
    if (admin.refreshToken !== refreshToken) throw new HttpException(this.i18nService.translate('exception.auth.unauthorized.notValidated'), HttpStatus.UNAUTHORIZED);

    const payload: IPayload = { _id: admin._id, email: admin.email, role: admin.role };
    const tokens: ITokens = await this.getTokens(payload);
    await this.updateRefreshToken(admin._id, tokens.refreshToken);

    this.setTokenCookies(res, tokens);

    return {
      data: user,
      message: this.i18nService.translate('response.auth.refreshTokens'),
      statusCode: HttpStatus.OK,
    };
  }

  private setTokenCookies(res: Response, tokens: ITokens): void {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.getMiliseconds(this.configService.get<string>('JWT_ACCESS_EXPIRES_IN')),
      path: '/',
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: this.getMiliseconds(this.configService.get<string>('JWT_REFRESH_EXPIRES_IN')),
      path: '/',
    });
  }

  private clearTokenCookies(res: Response): void {
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
      path: '/',
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 0,
      path: '/auth/refresh',
    });
  }

  private getMiliseconds(time: string): number {
    const match = time.match(/(\d+)([smhd])/);
    if (!match) return 1000 * 60 * 60;

    const value: number = parseInt(match[1]);
    const unit: string = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 1000 * 60;
      case 'h':
        return value * 1000 * 60 * 60;
      case 'd':
        return value * 1000 * 60 * 60 * 24;
      default:
        return 1000 * 60 * 60;
    }
  }
}
