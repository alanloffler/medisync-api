import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PassportStrategy } from '@nestjs/passport';
import type { IPayload } from '@auth/interface/payload.interface';
import { Admin } from '@admin/schema/admin.schema';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
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

  async validate(req: Request, payload: IPayload) {
    // const refreshToken = req?.cookies?.refreshToken;

    const admin: Admin = await this.adminModel.findById(payload._id);
    if (!admin) throw new HttpException('Unauthorized - Invalid refresh token (Jwt refresh strategy)', HttpStatus.UNAUTHORIZED);

    // Optional: Check if the refresh token is in your database and not revoked

    return payload;
  }
}
