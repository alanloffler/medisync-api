import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { IPayload, ITokens } from '@auth/interface/payload.interface';
import type { IRequest } from '@auth/interface/request.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { Admin } from '@admin/schema/admin.schema';
import { LoginDto } from '@auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  public async login(loginDto: LoginDto): Promise<IResponse<IPayload>> {
    const { email, password } = loginDto;

    const admin: Admin = await this.adminModel.findOne({ email });
    if (!admin) throw new HttpException('Failed to login admin, invalid email', HttpStatus.UNAUTHORIZED);

    const passwordIsValid: boolean = await bcryptjs.compare(password, admin.password);
    if (!passwordIsValid) throw new HttpException('Failed to login admin, invalid password', HttpStatus.UNAUTHORIZED);

    const payload = { _id: admin._id, email: admin.email, role: admin.role };

    const tokens: ITokens = await this.getTokens(payload);
    await this.updateRefreshToken(payload._id, tokens.refreshToken);

    const data: IPayload = { _id: admin._id, email: admin.email, role: admin.role, tokens };

    return { data, message: 'Admin logged in successfully', statusCode: HttpStatus.OK };
  }

  public async getTokens(payload: any): Promise<ITokens> {
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

    this.logger.log(`Tokens generated for admin with id ${payload._id}. \nAccess Token: ${accessToken.slice(0, 10)}..., \nRefresh Token: ${refreshToken.slice(0, 10)}...`);
    return { accessToken, refreshToken };
  }

  public async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const tokenUpdate: Admin = await this.adminModel.findByIdAndUpdate(id, { refreshToken });
    if (!tokenUpdate) throw new HttpException('Failed to update refresh token', HttpStatus.BAD_REQUEST);

    this.logger.log(`Refresh token updated for admin with id ${id}. Token: ${refreshToken?.slice(0, -10)}...`);
    return;
  }

  public async logout(req: IRequest): Promise<IResponse<IPayload>> {
    const id: string = req.user._id;
    await this.updateRefreshToken(id, null);
    return { data: null, message: 'Admin logged out successfully', statusCode: HttpStatus.OK };
  }
}
