import * as bcryptjs from 'bcryptjs';
import { Admin } from '@admin/schema/admin.schema';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import type { ILogin } from '@auth/interface/login.interface';
import type { IResponse } from '@common/interfaces/response.interface';
import { LoginDto } from '@auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<IResponse<ILogin>> {
    const { email, password } = loginDto;

    const admin: Admin = await this.adminModel.findOne({ email });
    if (!admin) throw new HttpException('Failed to login admin, invalid email', HttpStatus.UNAUTHORIZED);

    const passwordIsValid: boolean = await bcryptjs.compare(password, admin.password);
    if (!passwordIsValid) throw new HttpException('Failed to login admin, invalid password', HttpStatus.UNAUTHORIZED);

    const payload = { _id: admin._id, email: admin.email, role: admin.role };
    const token: string = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    const data: ILogin = { _id: admin._id, email: admin.email, role: admin.role, token };

    return { data, message: 'Admin logged in successfully', statusCode: HttpStatus.OK };
  }
}
