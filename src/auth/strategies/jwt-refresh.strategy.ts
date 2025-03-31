import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PassportStrategy } from '@nestjs/passport';
import type { I18nTranslations } from '@i18n/i18n.generated';
import type { IPayload } from '@auth/interface/payload.interface';
import { Admin } from '@admin/schema/admin.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refreshToken;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IPayload): Promise<IPayload> {
    console.log(req.cookies);
    if (!payload) throw new HttpException('Invalid jwt', HttpStatus.BAD_REQUEST);

    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new HttpException('There is no refresh token', HttpStatus.BAD_REQUEST);

    const admin: Admin = await this.adminModel.findById(payload._id);
    if (!admin) throw new HttpException(this.i18nService.t('exception.auth.unauthorized.refreshToken'), HttpStatus.UNAUTHORIZED);

    if (admin.refreshToken !== refreshToken) {
      console.log('the refresh token doesnt match with database');
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    return payload;
  }
}
