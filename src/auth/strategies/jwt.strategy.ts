import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PassportStrategy } from '@nestjs/passport';
import type { IPayload } from '@auth/interface/payload.interface';
import { Admin } from '@admin/schema/admin.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  public async validate(payload: IPayload): Promise<IPayload> {
    const admin: Admin = await this.adminModel.findById(payload._id);
    if (!admin) throw new HttpException('Unauthorized - Invalid token (Jwt strategy)', HttpStatus.UNAUTHORIZED);

    return payload;
  }
}
