import * as bcryptjs from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { IPayload } from '@auth/interface/payload.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import type { ITokens } from '@auth/interface/tokens.interface';
import { Admin } from '@admin/schema/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger: Logger = new Logger(AuthService.name);

  public async loginWithCredentials(admin: IPayload): Promise<IResponse<IPayload>> {
    const payload: IPayload = {
      _id: admin._id,
      email: admin.email,
      role: admin.role,
    };

    const tokens: ITokens = await this.getTokens(payload);
    await this.updateRefreshToken(payload._id, tokens.refreshToken);

    return {
      data: payload,
      message: 'Admin logged successfully',
      statusCode: HttpStatus.OK,
      tokens,
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

      this.logger.log(`Tokens generated for admin with id ${payload._id}. \nAccess Token: ${accessToken.slice(-10)}\nRefresh Token: ${refreshToken.slice(-10)}`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Failed to generate tokens for admin with id ${payload._id}. Error: ${error.message}`);
      throw new HttpException('Failed to generate tokens', HttpStatus.BAD_REQUEST);
    }
  }

  public async updateRefreshToken(id: string, refreshToken: string): Promise<void> {
    const tokenUpdate: Admin = await this.adminModel.findByIdAndUpdate(id, { refreshToken });
    if (!tokenUpdate) throw new HttpException('Failed to update refresh token', HttpStatus.BAD_REQUEST);

    this.logger.log(`Refresh token updated for admin with id ${id}. Token: ${refreshToken?.slice(-10)}`);
    return;
  }

  public async logout(user: IPayload): Promise<IResponse<IPayload>> {
    const id: string = user._id;
    await this.updateRefreshToken(id, null);
    return { data: null, message: 'Admin logged out successfully', statusCode: HttpStatus.OK };
  }

  public async refreshTokens(user: IPayload, _tokens: ITokens): Promise<IResponse<IPayload>> {
    const admin: Admin = await this.adminModel.findById(user._id);
    if (!admin || !admin.refreshToken) throw new HttpException('Unauthorized, invalid refresh token', HttpStatus.UNAUTHORIZED);
    if (admin.refreshToken !== _tokens.refreshToken) throw new HttpException('Unauthorized, the token could not be verified', HttpStatus.UNAUTHORIZED);

    const payload: IPayload = { _id: admin._id, email: admin.email, role: admin.role };
    const tokens: ITokens = await this.getTokens(payload);
    await this.updateRefreshToken(admin._id, tokens.refreshToken);

    return { data: user, message: 'Tokens refreshed successfully', statusCode: HttpStatus.OK, tokens };
  }
}
